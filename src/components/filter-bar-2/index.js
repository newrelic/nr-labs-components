import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'nr1';

import { Dropdown } from './components';

import styles from './styles.scss';

const FILTER_PARTS = {
  KEY: 0,
  OPERATOR: 1,
  VALUE: 2,
  CONJUNCTION: 3,
};
const OPERATORS = {
  STRING: ['=', '!=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN'],
  NUMERIC: ['=', '!=', '>', '<', '<=', '>=', 'IN', 'NOT IN'],
  BOOLEAN: ['IS'],
};
const CONJUNCTIONS = ['AND', 'OR'];

const isMultiple = (operator) => operator === 'IN' || operator === 'NOT IN';

const formatDropdownItems = (items) =>
  items?.map((value, index) => ({ value, index })) || [];

const FilterBar2 = ({ options = [], onChange }) => {
  const [filters, setFilters] = useState([]);
  const [editingFilterIndex, setEditingFilterIndex] = useState(-1);
  const filterRef = useRef(null);
  const prevFilterString = useRef('');

  useEffect(() => {
    const monitorClicksOutside = ({ target } = {}) => {
      if (!filterRef.current?.contains?.(target)) {
        setEditingFilterIndex(-1);
      }
    };
    document.addEventListener('mousedown', monitorClicksOutside);

    return () =>
      document.removeEventListener('mousedown', monitorClicksOutside);
  }, []);

  const itemsAtIndex = useCallback(
    (idx = 0, curFilter = []) => {
      const partId = idx % 4;
      if (partId === FILTER_PARTS.KEY)
        return options.map(({ option }) => option);
      if (partId === FILTER_PARTS.OPERATOR) {
        const { type } = curFilter[FILTER_PARTS.KEY];
        return OPERATORS[(type || '').toUpperCase() || 'STRING'];
      }
      if (partId === FILTER_PARTS.VALUE) {
        const { index = -1 } = curFilter[FILTER_PARTS.KEY];
        return index > -1 ? options[index]?.values || [] : [];
      }
      if (partId === FILTER_PARTS.CONJUNCTION) return CONJUNCTIONS;
    },
    [options]
  );

  const dropdownItems = useMemo(() => {
    const curIdx = filters?.length || 0;
    const filterStartIdx = Math.floor(curIdx / 4) * 4;
    const curFilter = filters?.slice(filterStartIdx, filterStartIdx + 4);

    return itemsAtIndex?.(curIdx, curFilter);
  }, [filters, itemsAtIndex]);

  const updateFilterAtIndex = useCallback(
    (update, idx, moveTo) => {
      const isKey = !((idx || 0) % 4);

      let filterItem;
      if (isKey) {
        const { type } = options[update?.index];
        filterItem = type ? { ...update, type } : update;
      } else {
        filterItem = update;
      }

      setFilters((fs) =>
        idx === fs.length
          ? [...fs, filterItem]
          : fs.map((f, i) => (i === idx ? filterItem : f))
      );

      if (!update.values)
        setEditingFilterIndex((efi) =>
          typeof moveTo === 'number' ? moveTo : efi + 1
        );
    },
    [options]
  );

  useEffect(() => {
    const filterSets = [];
    for (let i = 0; i < filters.length; i += 4) {
      const filterGroup = filters.slice(i, i + 4);

      if (filterGroup.length > 2) {
        const { type = 'string', value: key = '' } = filterGroup[0];
        const { value: op } = filterGroup[1];
        const { value: val, values: vals } = filterGroup[2];
        let groupStr = `${key} ${op}`;
        const delim = type === 'string' ? "'" : '';
        if (isMultiple(op)) {
          const valStr =
            vals?.map((v) => v.value)?.join(`${delim}, ${delim}`) || val || '';
          groupStr = `${groupStr} (${delim}${valStr}${delim})`;
        } else {
          const valStr = val || vals?.[0]?.value || '';
          groupStr = `${groupStr} ${delim}${valStr}${delim}`;
        }
        if (filterGroup.length === 4 && filters.length % 4 === 3) {
          groupStr = `${groupStr} ${filterGroup[3].value}`;
        }
        filterSets.push(groupStr);
      }
    }
    const filterString = filterSets.join(' ');
    if (onChange && filterString !== prevFilterString.current) {
      prevFilterString.current = filterString;
      onChange(filterString);
    }
  }, [filters, onChange]);

  const displayFilters = useMemo(() => {
    const filterSets = [];
    const isBeingEdited = (idx) => editingFilterIndex === idx;
    for (let i = 0; i < filters.length; i += 4) {
      const filterGroup = filters.slice(i, i + 4);
      const isFilterGroupMultiple = isMultiple(filterGroup[1]?.value);
      let filterGroupSelections = [];
      if (filterGroup.length > 2) {
        const { values: vals, value: val } = filterGroup[2] || {};
        if (vals?.length) {
          filterGroupSelections = isFilterGroupMultiple
            ? vals.map((v) => v.value)
            : [vals[0].value];
        } else if (val) {
          filterGroupSelections = [val];
        }
      }

      filterSets.push(
        <Fragment key={i}>
          <div className={styles['filter-block']}>
            {filterGroup.slice(0, 3)?.map(({ value }, fi) => (
              <div
                key={`${i}_${fi}`}
                className={`${styles['filter-token']} ${
                  isBeingEdited(i + fi) ? styles['is-editing'] : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (fi) setEditingFilterIndex(i + fi);
                }}
              >
                <span>
                  {fi === 2 ? filterGroupSelections.join(', ') : value}
                </span>
                {isBeingEdited(i + fi) ? (
                  <Dropdown
                    items={formatDropdownItems(
                      itemsAtIndex(i + fi, filterGroup)
                    )}
                    hasSearch={fi === 0 || fi === 2}
                    isMultiple={fi === 2 && isFilterGroupMultiple}
                    selections={fi === 2 ? filterGroupSelections : [value]}
                    onSelect={(args) => updateFilterAtIndex(args, i + fi)}
                  />
                ) : null}
              </div>
            ))}
            <div
              className={styles['del-btn']}
              onClick={(e) => {
                e.stopPropagation();
                setFilters((fts) => {
                  const newFilters = [...fts];
                  newFilters.splice(i, 4);
                  return newFilters;
                });
              }}
            >
              <Icon type={Icon.TYPE.INTERFACE__OPERATIONS__CLOSE__SIZE_8} />
            </div>
          </div>
          {filterGroup.length === 4 ? (
            <div
              key={`${i}_4`}
              className={styles['filter-conjunction']}
              onClick={(e) => {
                e.stopPropagation();
                setEditingFilterIndex(i + 3);
              }}
            >
              <span>{filterGroup[3]?.value}</span>
              {isBeingEdited(i + 3) ? (
                <Dropdown
                  items={formatDropdownItems(itemsAtIndex(i + 3, filterGroup))}
                  selections={[filterGroup[3]?.value]}
                  onSelect={(args) =>
                    updateFilterAtIndex(args, i + 3, filters.length)
                  }
                />
              ) : null}
            </div>
          ) : null}
        </Fragment>
      );
    }
    return filterSets;
  }, [filters, editingFilterIndex, itemsAtIndex, updateFilterAtIndex]);

  return (
    <div className={styles['filter-bar']} ref={filterRef}>
      {displayFilters}
      <div className={styles['filter-entry']}>
        <Button
          iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
          sizeType={Button.SIZE_TYPE.SMALL}
          ariaLabel="Click to filter"
          onClick={() => setEditingFilterIndex(filters.length)}
        />
        {editingFilterIndex === filters.length ? (
          <Dropdown
            items={formatDropdownItems(dropdownItems)}
            hasSearch={!(filters.length % 2)}
            isMultiple={isMultiple(filters[filters.length - 1]?.value)}
            onSelect={(args) => updateFilterAtIndex(args, filters.length)}
          />
        ) : null}
      </div>
    </div>
  );
};

FilterBar2.propTypes = {
  options: PropTypes.shape({
    option: PropTypes.string,
    type: PropTypes.oneOf(['string', 'number', 'boolean']),
    values: PropTypes.arrayOf(PropTypes.string),
  }),
  onChange: PropTypes.func,
};

export default FilterBar2;
