import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Icon, TextField } from 'nr1';

import styles from './styles.scss';

const Dropdown = ({
  items = [],
  selected = [],
  onChange,
  onClose,
  allowPartialMatches = false,
  isMultiSelect = false,
  hasSearch = true,
  valueKey = 'value',
  labelKey = 'label',
}) => {
  const [displayItems, setDisplayItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm('');
    setDisplayItems(() => [...items]);
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const searchHandler = useCallback(
    (term) => {
      setSearchTerm(term);
      setDisplayItems(() => {
        const lowerCaseSearchTerm = term.toLowerCase();
        let itemsList = items.filter((item) =>
          String(item[labelKey] ?? item[valueKey])
            .toLowerCase()
            .includes(lowerCaseSearchTerm)
        );
        if (term.trim() && allowPartialMatches) {
          return itemsList.some((item) => item[valueKey] === term)
            ? itemsList
            : [{ [valueKey]: term, [labelKey]: term }, ...itemsList];
        } else {
          return itemsList;
        }
      });
    },
    [items, labelKey, valueKey, allowPartialMatches]
  );

  const clickHandler = useCallback(
    (item) => {
      if (isMultiSelect) {
        const updatedSelection = selected.some(
          (s) => s[valueKey] === item[valueKey]
        )
          ? selected.filter((s) => s[valueKey] !== item[valueKey])
          : [...selected, item];
        onChange(updatedSelection);
      } else {
        onChange?.(item);
      }
    },
    [selected, isMultiSelect, onChange, valueKey]
  );

  if (!items?.length) return null;

  return (
    <div ref={dropdownRef} className={styles['filter-dropdown']}>
      {hasSearch && (
        <div className={styles['items-search']}>
          <TextField
            className={styles['search-input']}
            type={TextField.TYPE.SEARCH}
            placeholder="Search"
            value={searchTerm}
            onChange={({ target: { value } = {} } = {}) => searchHandler(value)}
          />
        </div>
      )}
      <div className={styles['dropdown-items']}>
        {displayItems.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className={`${styles['dropdown-item']} ${
              selected.includes(item[valueKey]) ? styles['highlighted'] : ''
            }`}
            onClick={() => clickHandler(item)}
          >
            <span className="col-1">
              {isMultiSelect &&
              selected.some((s) => s[valueKey] === item[valueKey]) ? (
                <Icon type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK} />
              ) : null}
            </span>
            <span className="col-2">
              {item[labelKey] ?? String(item[valueKey])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  items: PropTypes.array,
  selected: PropTypes.array,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  allowPartialMatches: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  hasSearch: PropTypes.bool,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
};

export default Dropdown;
