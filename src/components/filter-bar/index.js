import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Spinner } from 'nr1';

import { CloseIcon, FilterByIcon, OpenIcon, SearchIcon } from './icons';
import { Conjunction, Label, Value } from './components';
import {
  generateFilterString,
  optionsReducer,
  queryStringFromSelectedOption,
  textMatchObject,
  valueObject,
} from './utils';

import styles from './styles.scss';

const FilterBar = ({ options, onChange, getValues }) => {
  const thisComponent = useRef();
  const inputField = useRef();
  const [showItemsList, setShowItemsList] = useState(false);
  const [filterItems, setFilterItems] = useState([]);
  const [filterString, setFilterString] = useState('');
  const [searchTexts, setSearchTexts] = useState([]);
  const [isOptionOpen, setIsOptionOpen] = useState([]);
  const [isOptionNotMatchArr, setIsOptionNotMatchArr] = useState([]);
  const [isOptionDisplayed, setIsOptionDisplayed] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState([]);
  const [optionsSearchText, setOptionsSearchText] = useState('');
  const [values, setValues] = useState([]);
  const [shownValues, setShownValues] = useState([]);
  const [conjunctions, setConjunctions] = useState([]);
  const [textMatchIsSelected, setTextMatchIsSelected] = useState([]);
  const lastGroup = useRef('');
  const searchTimeout = useRef();

  const MIN_ITEMS_SHOWN = 5;
  const MAX_DROPDOWN_WIDTH = 360;

  useEffect(() => {
    function handleClicksOutsideComponent(evt) {
      if (
        showItemsList &&
        thisComponent &&
        !thisComponent.current.contains(evt.target)
      )
        setShowItemsList(false);
    }
    document.addEventListener('mousedown', handleClicksOutsideComponent);

    return function cleanup() {
      document.removeEventListener('mousedown', handleClicksOutsideComponent);
    };
  });

  useEffect(() => {
    const optionsReduction = (options || []).reduce(optionsReducer, {
      open: [],
      notMatchs: [],
      displayed: [],
      loading: [],
      optionValues: [],
      srchTxts: [],
      txtMatchSelected: [],
      fltrItems: [],
      cnjctns: [],
      valsShown: [],
    });

    setIsOptionOpen(optionsReduction.open || []);
    setIsOptionNotMatchArr(optionsReduction.notMatchs || []);
    setIsOptionDisplayed(optionsReduction.displayed || []);
    setOptionsLoading(optionsReduction.loading || []);
    setSearchTexts(optionsReduction.srchTxts || []);
    setTextMatchIsSelected(optionsReduction.txtMatchSelected || []);
    setShownValues(optionsReduction.valsShown || []);
    setValues(optionsReduction.optionValues || []);
    setFilterItems(optionsReduction.fltrItems || []);
    setConjunctions(optionsReduction.cnjctns || []);
  }, [options]);

  useEffect(() => {
    const fltrStr = generateFilterString(
      filterItems,
      conjunctions,
      values,
      searchTexts,
      isOptionNotMatchArr
    );
    if (fltrStr !== filterString) {
      setFilterString(fltrStr);
      if (onChange) onChange(fltrStr);
    }
  }, [filterItems, conjunctions, values, searchTexts, isOptionNotMatchArr]);

  const itemsListWidth =
    inputField && inputField.current
      ? inputField.current.clientWidth - 14
      : MAX_DROPDOWN_WIDTH;
  const dropdownWidth = Math.min(itemsListWidth, MAX_DROPDOWN_WIDTH);
  const checkboxWidth = (dropdownWidth - 32) / 2;

  const checkHandler = (optionIdx, valueIdx) => {
    const vals = [...values];
    vals[optionIdx][valueIdx].isSelected =
      !vals[optionIdx][valueIdx].isSelected;

    const { fltrItems, itemUpdated } = [...filterItems].reduce(
      (acc, fi) => {
        if (fi.optionIndex !== optionIdx)
          return {
            ...acc,
            fltrItems: [...acc.fltrItems, fi],
          };
        return vals[optionIdx][valueIdx].isSelected
          ? {
              ...acc,
              fltrItems: [
                ...acc.fltrItems,
                {
                  ...fi,
                  matchText: '',
                  valueIndexes: [...fi.valueIndexes, valueIdx],
                },
              ],
              itemUpdated: true,
            }
          : { ...acc, itemUpdated: true };
      },
      { fltrItems: [], itemUpdated: false }
    );
    if (!itemUpdated) {
      const { option: attribute, type } = options[optionIdx];
      fltrItems.push({
        attribute,
        optionIndex: optionIdx,
        type,
        valueIndexes: [valueIdx],
      });
      setConjunctions((cnjs) => [...cnjs, 'AND']);
    }

    if (vals[optionIdx][valueIdx].isSelected)
      setTextMatchIsSelected((tms) =>
        tms.map((tm, i) => (i === optionIdx ? false : tm))
      );
    setValues(vals);
    setFilterItems(fltrItems);
  };

  const checkTextMatchHandler = (optionIdx) => {
    const isSelected = !textMatchIsSelected[optionIdx];
    const matchText = isSelected ? searchTexts[optionIdx] : '';
    setTextMatchIsSelected((tms) =>
      tms.map((t, i) => (i === optionIdx ? isSelected : t))
    );
    setValues((vals) =>
      vals.map((val, i) =>
        i === optionIdx ? val.map((v) => ({ ...v, isSelected: false })) : val
      )
    );
    const { fltrItems, itemUpdated } = [...filterItems].reduce(
      (acc, fi) => {
        if (fi.optionIndex !== optionIdx)
          return {
            ...acc,
            fltrItems: [...acc.fltrItems, fi],
          };
        return isSelected
          ? {
              ...acc,
              fltrItems: [
                ...acc.fltrItems,
                { ...fi, matchText, valueIndexes: [] },
              ],
              itemUpdated: true,
            }
          : { ...acc, itemUpdated: true };
      },
      { fltrItems: [], itemUpdated: false }
    );
    if (!itemUpdated) {
      const { option: attribute, type } = options[optionIdx];
      fltrItems.push({
        attribute,
        optionIndex: optionIdx,
        type,
        matchText,
        valueIndexes: [],
      });
      setConjunctions((cnjs) => [...cnjs, 'AND']);
    }
    setFilterItems(fltrItems);
  };

  const updateOptionsSearchText = (evt) => {
    const searchText = evt.target.value;
    setOptionsSearchText(searchText);
    const searchRE = new RegExp(searchText, 'i');
    setIsOptionDisplayed(options.map(({ option }) => searchRE.test(option)));
    setShowItemsList(true);
  };

  const updateSearchText = (evt, option, idx) => {
    const searchText = evt.target.value;
    setSearchTexts((sts) => sts.map((st, i) => (i === idx ? searchText : st)));
    const searchRE = new RegExp(searchText.replaceAll('%', '.*'), 'i');

    clearTimeout(searchTimeout.current);
    if (searchText.trim()) {
      searchTimeout.current = setTimeout(async () => {
        setOptionsLoading(optionsLoading.map((l, i) => (i === idx ? true : l)));
        const updatedValues = await loadValuesLive(
          option.option,
          option.type,
          idx,
          searchText,
          searchRE
        );
        setValues(
          options.map((_, i) => (i === idx ? updatedValues : values[i]))
        );
        setShownValues(
          shownValues.map((s, i) =>
            i === idx // eslint-disable-line no-nested-ternary
              ? updatedValues.length > 6
                ? 5
                : updatedValues.length
              : s
          )
        );
        setOptionsLoading(
          optionsLoading.map((l, i) => (i === idx ? false : l))
        );
      }, 500);
    } else {
      setValues(
        values.map((val, i) =>
          i === idx ? val.map((v) => ({ ...v, isIncluded: true })) : val
        )
      );
      setShownValues(
        shownValues.map((show, i) =>
          i === idx ? shownCount(values[idx].length, show) : show
        )
      );
    }
  };

  const includedValuesCount = (arr) =>
    arr.filter((val) => val.isIncluded).length;

  const shownCount = (count, show = MIN_ITEMS_SHOWN) =>
    count > Math.max(show, MIN_ITEMS_SHOWN)
      ? Math.max(show, MIN_ITEMS_SHOWN)
      : count;

  const optionClickHandler = async (option, idx) => {
    const shouldLoad = !values[idx].length;
    setIsOptionOpen((ioo) => ioo.map((o, i) => (i === idx ? !o : o)));
    setOptionsLoading(
      optionsLoading.map((l, i) => (i === idx && shouldLoad ? true : l))
    );
    if (shouldLoad) loadValues(option, idx);
  };

  const updateShownValues = (evt, idx) => {
    evt.preventDefault();
    const shown = [...shownValues];
    shown[idx] = values[idx].filter((val) => val.isIncluded).length;
    setShownValues(shown);
  };

  const shownAndIncluded = (vals, idx) =>
    [...vals].reduce(
      (acc, cur) =>
        cur.isIncluded && acc.length < shownValues[idx] ? [...acc, cur] : acc,
      []
    );

  const loadValues = async (option, idx) => {
    const vals = getValues ? await getValues(option.option) : [];
    setValues(
      options.map((o, i) =>
        i === idx
          ? (vals || []).map((v) =>
              valueObject({ value: v, isSelected: false }, o)
            )
          : values[i]
      )
    );
    setShownValues(
      shownValues.map(
        (s, i) => (i === idx ? (vals.length > 6 ? 5 : vals.length) : s) // eslint-disable-line no-nested-ternary
      )
    );
    setOptionsLoading(optionsLoading.map((l, i) => (i === idx ? false : l)));
  };

  const loadValuesLive = async (attr, type, idx, searchStr, searchRE) => {
    let cond = ` WHERE `;
    if (type === 'string') {
      cond += ` ${attr} LIKE '%${searchStr}%' `; // TODO: remove '%' if not needed
    } else {
      const matches = [...searchStr.matchAll(/([><]+)\s{0,}([.-\d]{1,})/g)];
      if (matches.length) {
        cond += matches
          .map(([, op, num]) =>
            op && !isNaN(num) ? ` ${attr} ${op} ${Number(num)} ` : ''
          )
          .join(' AND ');
      } else {
        const sanitizedSearchStr = searchStr.replace(/[^\w\s]/gi, '');
        cond += ` ${attr} = ${sanitizedSearchStr || 'false'} `;
      }
    }
    const vals = getValues ? await getValues(attr, cond) : [];
    const prevValues = values[idx].map((v) => ({
      ...v,
      isIncluded: searchRE.test(v.display) || vals.includes(v.value),
    }));
    return vals.reduce((acc, val) => {
      if (!acc.some((v) => v.value === val))
        acc.push(
          valueObject({ value: val, isSelected: false }, { type, option: attr })
        );
      return acc;
    }, prevValues);
  };

  const selectedValuesCounter = (idx) => {
    const count = selectedValuesCount(idx);
    if (count)
      return <span className={styles['list-option-count']}>{count}</span>;
  };

  const selectedValuesCount = (idx) =>
    values[idx].reduce((acc, val) => (val.isSelected ? (acc += 1) : acc), 0);

  const removeFilterItem = (idx) => {
    const fltrItems = [...filterItems];
    const cnjctns = [...conjunctions];
    const optIdx = fltrItems[idx].optionIndex;
    const vals = values.map((opt, i) =>
      i === optIdx ? opt.map((val) => ({ ...val, isSelected: false })) : opt
    );
    fltrItems.splice(idx, 1);
    cnjctns.splice(idx, 1);
    setTextMatchIsSelected((tms) =>
      tms.map((t, i) => (i === optIdx ? false : t))
    );
    setConjunctions(cnjctns);
    setFilterItems(fltrItems);
    setValues(vals);
  };

  const changeConjunction = (idx, operator) =>
    setConjunctions(
      conjunctions.map((conj, i) => (i === idx ? operator : conj))
    );

  const changeMatchTypeHandler = (idx, isNotMatch, evt) => {
    evt.stopPropagation();
    setIsOptionNotMatchArr((arr) =>
      arr.map((onm, i) => (i === idx ? isNotMatch : onm))
    );
  };

  const groupBar = (group) => {
    lastGroup.current = group;
    return <div className={styles['list-group']}>{group}</div>;
  };

  return (
    <div className={styles['filter-bar']} ref={thisComponent}>
      <div className={styles['input-field']} ref={inputField}>
        <div className={styles['input-field-icon']}>
          <img src={FilterByIcon} alt="filter by" />
        </div>
        <div
          className={`${styles['input-field-input']} ${
            !filterItems.length ? styles.placeholder : ''
          }`}
          onClick={() => setShowItemsList(!showItemsList)}
        >
          {filterItems.map((item, i) => (
            <React.Fragment key={i}>
              <Label
                value={queryStringFromSelectedOption(
                  item,
                  values,
                  searchTexts,
                  isOptionNotMatchArr
                )}
                onRemove={() => removeFilterItem(i)}
              />
              <Conjunction
                operator={conjunctions[i]}
                isHint={i === filterItems.length - 1}
                onChange={(operator) => changeConjunction(i, operator)}
              />
            </React.Fragment>
          ))}
          <span className={styles['input-field-search']}>
            <input
              type="text"
              className="u-unstyledInput"
              placeholder={!filterItems.length ? 'Filter by...' : ''}
              value={optionsSearchText}
              onChange={updateOptionsSearchText}
            />
          </span>
        </div>
      </div>
      {showItemsList ? (
        <div className={styles['list']} style={{ width: dropdownWidth }}>
          {options.map((option, i) =>
            isOptionDisplayed[i] ? (
              <>
                {option.group && option.group !== lastGroup.current
                  ? groupBar(option.group)
                  : null}
                <div className={styles['list-options']}>
                  <div
                    className={styles['list-option']}
                    onClick={() => optionClickHandler(option, i)}
                  >
                    <img
                      src={isOptionOpen[i] ? OpenIcon : CloseIcon}
                      alt="show or hide options"
                    />
                    <span>{option.option}</span>
                    {optionsLoading[i] ? (
                      <Spinner inline />
                    ) : (
                      selectedValuesCounter(i)
                    )}
                    {isOptionOpen[i] ? (
                      <span
                        className={`${styles['list-option-picker']} ${
                          !selectedValuesCount(i) ? styles.lighten : ''
                        }`}
                      >
                        <span
                          className={`${styles.equal} ${
                            !isOptionNotMatchArr[i] ? styles.selected : ''
                          }`}
                          onClick={(evt) =>
                            changeMatchTypeHandler(i, false, evt)
                          }
                        />
                        <span
                          className={`${styles['not-equal']} ${
                            isOptionNotMatchArr[i] ? styles.selected : ''
                          }`}
                          onClick={(evt) =>
                            changeMatchTypeHandler(i, true, evt)
                          }
                        />
                      </span>
                    ) : null}
                  </div>
                  {isOptionOpen[i] ? (
                    <>
                      <div className={styles['list-option-search']}>
                        <img src={SearchIcon} alt="search options" />
                        <input
                          type="text"
                          placeholder="type to filter or for partial matches"
                          style={{ backgroundColor: '#FFF' }}
                          value={searchTexts[i]}
                          onChange={(evt) => updateSearchText(evt, option, i)}
                        />
                      </div>
                      <div className={styles['list-option-values']}>
                        {option.type === 'string' && searchTexts[i] ? (
                          <Value
                            value={textMatchObject(
                              searchTexts[i],
                              isOptionNotMatchArr[i],
                              textMatchIsSelected[i]
                            )}
                            width={checkboxWidth}
                            optionIndex={i}
                            valueIndex={99999}
                            onChange={checkTextMatchHandler}
                          />
                        ) : null}
                        {shownAndIncluded(values[i], i).map((value, j) => (
                          <Value
                            value={value}
                            width={checkboxWidth}
                            optionIndex={i}
                            valueIndex={j}
                            onChange={checkHandler}
                            key={j}
                          />
                        ))}
                        {includedValuesCount(values[i]) > shownValues[i] ? (
                          <div
                            className={styles['list-option-value']}
                            style={{ width: checkboxWidth }}
                          >
                            <a
                              onClick={(evt) => updateShownValues(evt, i)}
                            >{`Show ${
                              includedValuesCount(values[i]) - shownValues[i]
                            } more...`}</a>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null
          )}
        </div>
      ) : null}
    </div>
  );
};

FilterBar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      option: PropTypes.string,
      type: PropTypes.oneOf(['string', 'number', 'boolean']),
      isNotMatch: PropTypes.bool,
      textMatch: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            value: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
              PropTypes.bool,
            ]),
            isSelected: PropTypes.bool,
          }),
        ])
      ),
      group: PropTypes.string,
      info: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    })
  ),
  onChange: PropTypes.func,
  getValues: PropTypes.func,
};

export default FilterBar;
