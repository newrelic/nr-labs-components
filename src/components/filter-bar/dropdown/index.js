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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm('');
    setDisplayItems(() => [...items]);
  }, [items]);

  useEffect(() => setFocusedIndex(0), [displayItems]);

  useEffect(() => {
    if (!hasSearch && dropdownRef.current) {
      setTimeout(() => {
        dropdownRef.current?.focus();
      }, 0);
    }
  }, [hasSearch]);

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
      if (!item) return;
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

  const keyDownHandler = useCallback(
    (e) => {
      if (!displayItems.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < displayItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        clickHandler(displayItems[focusedIndex]);
      } else if (e.key === 'Escape') {
        onClose?.();
      }
    },
    [displayItems, focusedIndex, clickHandler, onClose]
  );

  if (!items?.length && !allowPartialMatches) return null;

  return (
    <div
      ref={dropdownRef}
      className={styles['filter-dropdown']}
      onKeyDown={keyDownHandler}
      tabIndex={0}
    >
      {hasSearch && (
        <div className={styles['items-search']}>
          <TextField
            className={styles['search-input']}
            type={TextField.TYPE.SEARCH}
            placeholder="Search"
            value={searchTerm}
            onChange={({ target: { value } = {} } = {}) => searchHandler(value)}
            autoFocus={true}
          />
        </div>
      )}
      <div className={styles['dropdown-items']}>
        {displayItems.map((item, itemIndex) => {
          const isSelected = selected.some(
            (s) => s[valueKey] === item[valueKey]
          );
          const isFocused = itemIndex === focusedIndex;
          return (
            <div
              key={itemIndex}
              className={`${styles['dropdown-item']} ${
                isSelected || isFocused ? styles['highlighted'] : ''
              }`}
              onClick={() => clickHandler(item)}
              onMouseEnter={() => setFocusedIndex(itemIndex)}
              style={
                isFocused
                  ? {
                      outline: '1px solid #499df4',
                      outlineOffset: '-1px',
                      borderRadius: '0',
                    }
                  : {}
              }
            >
              <span className="col-1">
                {isMultiSelect && isSelected ? (
                  <Icon type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK} />
                ) : null}
              </span>
              <span className="col-2">
                {item[labelKey] ?? String(item[valueKey])}
              </span>
            </div>
          );
        })}
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
