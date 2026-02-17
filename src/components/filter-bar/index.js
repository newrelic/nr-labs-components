import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'nr1';

import Dropdown from './dropdown';
import { uuid } from '../../utils';

import styles from './styles.scss';

const FILTER_PARTS = {
  KEY: 1,
  OPERATOR: 2,
  VALUES: 3,
  CONJUNCTION: 4,
};

const FILTER_PARTS_ARR = ['key', 'operator', 'values', 'conjunction'];

const FILTER_PARTS_ARR_KEYS = {
  KEY: 'key',
  OPERATOR: 'operator',
  VALUES: 'values',
  CONJUNCTION: 'conjunction',
};

const OPERATORS = {
  string: [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not Equals' },
    { value: 'LIKE', label: 'Contains', partialMatches: true },
    { value: 'NOT LIKE', label: 'Not Contains', partialMatches: true },
    { value: 'IN', label: 'Is One Of', multiValue: true },
    { value: 'NOT IN', label: 'Is Not One Of', multiValue: true },
    { value: 'IS NULL', label: 'Is Null', noValueNeeded: true },
    { value: 'IS NOT NULL', label: 'Is Not Null', noValueNeeded: true },
    { value: 'STARTS WITH', label: 'Starts With' },
    { value: 'ENDS WITH', label: 'Ends With' },
  ],
  numeric: [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not Equals' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater Than or Equals' },
    { value: '<=', label: 'Less Than or Equals' },
    { value: 'IN', label: 'Is One Of', multiValue: true },
    { value: 'NOT IN', label: 'Is Not One Of', multiValue: true },
    { value: 'IS NULL', label: 'Is Null', noValueNeeded: true },
    { value: 'IS NOT NULL', label: 'Is Not Null', noValueNeeded: true },
  ],
  boolean: [
    { value: '=', label: 'Is' },
    { value: 'IS NULL', label: 'Is Null', noValueNeeded: true },
    { value: 'IS NOT NULL', label: 'Is Not Null', noValueNeeded: true },
  ],
};

const CONJUNCTIONS = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
];

/* eslint-disable no-unused-vars */
const BOOLEAN_VALUES = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];
/* eslint-enable no-unused-vars */

const CONDITION_OBJECT = {
  id: null,
  key: null,
  operator: null,
  values: [],
  conjunction: null,
};

const CONDITION_PARAMS = {
  optionType: null,
  optionIndex: -1,
  optionOperators: null,
  multiValue: false,
  noValueNeeded: false,
  partialMatches: false,
};

const filterPartFromPart = (part) => FILTER_PARTS[part.toUpperCase()];

const isValidValues = (values) => {
  if (Array.isArray(values) && values.length === 0) return false;
  return !!values;
};

const nextPartForCondition = ({ key, operator, values, conjunction } = {}) => {
  if (!key) return FILTER_PARTS.KEY;
  if (!operator) return FILTER_PARTS.OPERATOR;
  if (operator.noValueNeeded && !conjunction) return FILTER_PARTS.CONJUNCTION;
  if (!isValidValues(values)) return FILTER_PARTS.VALUES;
  if (!conjunction) return FILTER_PARTS.CONJUNCTION;
  return 0;
};

const paramsForCondition = (cond) => {
  const optionType = cond.key?.type;
  const optionOperators = cond.key?.operators;
  const optionIndex = Number.isInteger(cond.key?.index) ? cond.key.index : -1;
  const multiValue = !!cond.operator?.multiValue;
  const noValueNeeded = !!cond.operator?.noValueNeeded;
  return {
    optionType,
    optionOperators,
    optionIndex,
    multiValue,
    noValueNeeded,
  };
};

const FilterBar = forwardRef(
  ({ options, defaultSelections = [], onChange, isDisabled = false }, ref) => {
    const [conditions, setConditions] = useState(
      Array.isArray(defaultSelections) ? defaultSelections : []
    );
    const [editingPart, setEditingPart] = useState(0);
    const [dropdownItems, setDropdownItems] = useState([]);
    const [showDropdownAtEnd, setShowDropdownAtEnd] = useState(false);
    const editingConditionId = useRef(null);
    const nextEditingPart = useRef(null);
    const conditionParams = useRef(CONDITION_PARAMS);
    const conditionHasChanged = useRef(false);

    useImperativeHandle(
      ref,
      () => ({
        setSelections: (sel = []) => {
          editingConditionId.current = null;
          nextEditingPart.current = null;
          conditionParams.current = CONDITION_PARAMS;
          conditionHasChanged.current = false;
          setConditions((conds) => (Array.isArray(sel) ? sel : conds));
          setEditingPart(0);
          setDropdownItems([]);
          setShowDropdownAtEnd(false);
        },
      }),
      []
    );

    const addCondition = useCallback(() => {
      const id = uuid();
      editingConditionId.current = id;
      conditionParams.current = CONDITION_PARAMS;
      setConditions((conds) => [...conds, { ...CONDITION_OBJECT, id }]);
      setShowDropdownAtEnd(true);
    }, []);

    const addNextTokenHandler = useCallback(() => {
      if (!conditions.length) {
        addCondition();
      } else {
        const lastCond = conditions[conditions.length - 1];
        if (!lastCond || lastCond.conjunction) {
          addCondition();
        } else {
          editingConditionId.current = lastCond.id;
          conditionParams.current = paramsForCondition(lastCond);
          const nextPart = nextPartForCondition(lastCond);
          setEditingPart(nextPart);
          setShowDropdownAtEnd(true);
        }
      }
    }, [addCondition, conditions]);

    const deleteCondition = useCallback((id) => {
      editingConditionId.current = null;
      conditionParams.current = CONDITION_PARAMS;
      conditionHasChanged.current = true;
      setConditions((conds) => conds.filter((cond) => cond.id !== id));
    }, []);

    const dropdownChangeHandler = (selections) => {
      const curCondId = editingConditionId.current;
      conditionHasChanged.current = true;
      if (editingPart === FILTER_PARTS.KEY) {
        const updatedSelection = {
          ...selections,
          type: selections.type || 'string',
        };
        conditionParams.current = {
          ...conditionParams.current,
          optionType: updatedSelection.type,
          optionIndex: updatedSelection.index,
          optionOperators: updatedSelection.operators,
        };
        setConditions((conds) =>
          conds.map((cond) =>
            cond.id === curCondId ? { ...cond, key: updatedSelection } : cond
          )
        );
      } else if (editingPart === FILTER_PARTS.OPERATOR) {
        conditionParams.current = {
          ...conditionParams.current,
          multiValue: !!selections.multiValue,
          noValueNeeded: !!selections.noValueNeeded,
          partialMatches: !!selections.partialMatches,
        };
        setConditions((conds) =>
          conds.map((cond) => {
            if (cond.id !== curCondId) return cond;
            let values = cond.values;
            if (selections.multiValue && !Array.isArray(values)) {
              values = [values];
            } else if (!selections.multiValue && values?.length) {
              values = [];
            }
            return {
              ...cond,
              values,
              operator: selections,
            };
          })
        );
      } else if (editingPart === FILTER_PARTS.VALUES) {
        if (Array.isArray(selections)) {
          nextEditingPart.current = FILTER_PARTS.VALUES;
          setShowDropdownAtEnd(false);
        }
        setConditions((conds) =>
          conds.map((cond) =>
            cond.id === curCondId ? { ...cond, values: selections } : cond
          )
        );
      } else if (editingPart === FILTER_PARTS.CONJUNCTION) {
        setConditions((conds) =>
          conds.map((cond) =>
            cond.id === curCondId ? { ...cond, conjunction: selections } : cond
          )
        );
      }
    };

    const dropdownCloseHandler = useCallback(() => setEditingPart(0), []);

    useEffect(() => {
      if (isDisabled) {
        setEditingPart(0);
        setShowDropdownAtEnd(false);
        return;
      }

      if (conditionHasChanged.current) {
        conditionHasChanged.current = false;
        onChange?.(conditions || []);
      }
      const curCondId = editingConditionId.current;
      if (!curCondId) return;
      const curCondIdx = conditions.findIndex(({ id }) => id === curCondId);
      const nextPart =
        nextEditingPart.current || nextPartForCondition(conditions[curCondIdx]);
      if (nextPart) {
        nextEditingPart.current = null;
        setEditingPart(nextPart);
      } else {
        if (curCondIdx === conditions.length - 1) {
          addCondition();
        } else {
          const nextCond = conditions[curCondIdx + 1];
          editingConditionId.current = nextCond.id;
          conditionParams.current = paramsForCondition(nextCond);
          const nextCondPart = nextCond?.key
            ? FILTER_PARTS.OPERATOR
            : FILTER_PARTS.KEY;
          setEditingPart(nextCondPart);
        }
      }
    }, [conditions, onChange, isDisabled]);

    useEffect(() => {
      if (editingPart === FILTER_PARTS.KEY) {
        setDropdownItems(
          () =>
            options.map(({ option: value, type, operators }, index) => ({
              value,
              type,
              operators,
              index,
            })) || []
        );
      } else if (editingPart === FILTER_PARTS.OPERATOR) {
        setDropdownItems(() => {
          const { optionOperators, optionType } = conditionParams.current;
          if (optionOperators) return optionOperators;
          return OPERATORS[optionType] || [];
        });
      } else if (editingPart === FILTER_PARTS.VALUES) {
        setDropdownItems(() => {
          const curOptionValues =
            conditionParams.current.optionIndex in options
              ? options[conditionParams.current.optionIndex]?.values || []
              : [];
          const curCondValues = conditions.find(
            ({ id }) => id === editingConditionId.current
          )?.values;
          const curCondValsArr = Array.isArray(curCondValues)
            ? curCondValues
            : isValidValues(curCondValues)
            ? [curCondValues]
            : [];
          const valsArr = curCondValsArr.filter(
            (condVal) =>
              !curOptionValues.some((optVal) => optVal.value === condVal.value)
          );
          return [...valsArr, ...curOptionValues];
        });
      } else if (editingPart === FILTER_PARTS.CONJUNCTION) {
        setDropdownItems(() => [...CONJUNCTIONS]);
      } else {
        setDropdownItems(() => []);
      }
    }, [options, editingPart]);

    const dropdownSelected = useMemo(() => {
      const cond = conditions[conditions.length - 1];
      if (!cond) return [];
      if (editingPart === FILTER_PARTS.KEY) return cond.key ? [cond.key] : [];
      if (editingPart === FILTER_PARTS.OPERATOR)
        return cond.operator ? [cond.operator] : [];
      if (editingPart === FILTER_PARTS.VALUES)
        return Array.isArray(cond.values) ? cond.values : [cond.values];
      if (editingPart === FILTER_PARTS.CONJUNCTION)
        return cond.conjunction ? [cond.conjunction] : [];
      return [];
    }, [conditions, editingPart]);

    const shouldAllowPartials =
      editingPart === FILTER_PARTS.VALUES || editingPart === FILTER_PARTS.KEY;

    const isMultiSelect =
      editingPart === FILTER_PARTS.VALUES &&
      !!conditions.find(({ id }) => id === editingConditionId.current)?.operator
        ?.multiValue;

    const conditionPill = useCallback(
      (cond) => {
        if (!cond?.key) return null;
        return (
          <>
            <div className={styles['filter-block']}>
              {FILTER_PARTS_ARR.slice(0, 3).map((part) => {
                const token = cond[part];
                const isKey = part === FILTER_PARTS_ARR_KEYS.KEY;
                const isValues = part === FILTER_PARTS_ARR_KEYS.VALUES;
                const isValuesArr = isValues && Array.isArray(token);
                if (!(token?.value || (isValuesArr && token?.length)))
                  return null;

                const isBeingEdited =
                  editingConditionId.current === cond.id &&
                  editingPart === filterPartFromPart(part);
                const shouldAllowPartials =
                  isValues && !!cond.operator?.partialMatches;
                const isMultiSelect = isValues && !!cond.operator?.multiValue;
                return (
                  <div
                    key={`${cond.id}_${part}`}
                    className={`${styles['filter-token']} ${
                      isBeingEdited ? styles['is-editing'] : ''
                    }`}
                    onClick={() => {
                      if (isKey) return;
                      editingConditionId.current = cond.id;
                      conditionParams.current = paramsForCondition(cond);
                      setShowDropdownAtEnd(false);
                      setEditingPart(FILTER_PARTS[part.toUpperCase()]);
                    }}
                  >
                    <span>
                      {isValuesArr
                        ? token
                            ?.map(({ value }) => value)
                            .filter(Boolean)
                            .join(', ')
                        : token?.value}
                    </span>
                    {isBeingEdited ? (
                      <Dropdown
                        items={dropdownItems}
                        selected={isValuesArr ? token : [token]}
                        onChange={dropdownChangeHandler}
                        onClose={dropdownCloseHandler}
                        allowPartialMatches={shouldAllowPartials}
                        isMultiSelect={isMultiSelect}
                        hasSearch={isKey || isValues}
                      />
                    ) : null}
                  </div>
                );
              })}
              <div
                className={styles['del-btn']}
                onClick={() => deleteCondition(cond.id)}
              >
                <Icon type={Icon.TYPE.INTERFACE__OPERATIONS__CLOSE__SIZE_8} />
              </div>
            </div>
            {cond.conjunction ? (
              <div
                key={`${cond.id}_conjunction`}
                className={`${styles['filter-conjunction']} ${
                  editingConditionId.current === cond.id &&
                  editingPart === FILTER_PARTS.CONJUNCTION
                    ? styles['is-editing']
                    : ''
                }`}
                onClick={() => {
                  editingConditionId.current = cond.id;
                  conditionParams.current = paramsForCondition(cond);
                  setShowDropdownAtEnd(false);
                  setEditingPart(FILTER_PARTS.CONJUNCTION);
                }}
              >
                <span>{cond.conjunction.value}</span>
                {editingConditionId.current === cond.id &&
                editingPart === FILTER_PARTS.CONJUNCTION ? (
                  <Dropdown
                    items={dropdownItems}
                    selected={[cond.conjunction]}
                    onChange={dropdownChangeHandler}
                    onClose={dropdownCloseHandler}
                    hasSearch={false}
                  />
                ) : null}
              </div>
            ) : null}
          </>
        );
      },
      [
        editingPart,
        dropdownItems,
        deleteCondition,
        dropdownChangeHandler,
        dropdownCloseHandler,
      ]
    );

    return (
      <div className={styles['filter-bar']}>
        {conditions.map((cond) => conditionPill(cond))}
        <div className={styles['filter-entry']}>
          <Button
            iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
            sizeType={Button.SIZE_TYPE.SMALL}
            ariaLabel="Click to filter"
            onClick={() => addNextTokenHandler()}
            disabled={isDisabled}
          />
          {showDropdownAtEnd ? (
            <Dropdown
              items={dropdownItems}
              selected={dropdownSelected}
              onChange={dropdownChangeHandler}
              onClose={dropdownCloseHandler}
              allowPartialMatches={shouldAllowPartials}
              isMultiSelect={isMultiSelect}
              hasSearch={
                editingPart === FILTER_PARTS.KEY ||
                editingPart === FILTER_PARTS.VALUES
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
);

FilterBar.propTypes = {
  options: PropTypes.array,
  defaultSelections: PropTypes.array,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

FilterBar.displayName = 'FilterBar';

export default FilterBar;
