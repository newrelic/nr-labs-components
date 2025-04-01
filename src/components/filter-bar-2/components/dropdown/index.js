import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Checkbox, TextField } from 'nr1';

import styles from './styles.scss';

const Dropdown = ({
  items = [],
  hasSearch = false,
  isMultiple = false,
  selections = [],
  onSelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const localSelections = useRef(new Set());

  useEffect(() => setFilteredItems(items || []), [items]);

  useEffect(() => {
    localSelections.current = new Set(selections);
  }, [selections]);

  useEffect(
    () =>
      setFilteredItems(() =>
        items?.reduce(
          (acc, { value, index }) =>
            value.toLowerCase().includes(searchText.toLowerCase())
              ? [...acc, { value, index }]
              : acc,
          []
        )
      ),
    [items, searchText]
  );

  const clickHandler = useCallback(
    (e, item) => {
      e.stopPropagation();
      onSelect?.(item);
    },
    [onSelect]
  );

  const isSelected = (value = '') =>
    (selections || []).includes(value) || localSelections.current?.has(value);

  const checkedHandler = useCallback(
    (value = '', checked) => {
      if (checked) {
        localSelections.current?.add(value);
      } else {
        localSelections.current?.delete(value);
      }
      const values = (items || []).filter((item) =>
        localSelections.current?.has(item.value)
      );
      onSelect?.({ values });
    },
    [items, selections, onSelect]
  );

  if (!items?.length) return null;

  return (
    <div className={styles['dropdown-list']}>
      {hasSearch ? (
        <div className={styles['items-search']}>
          <TextField
            className={styles['search-input']}
            type={TextField.TYPE.SEARCH}
            placeholder="Search"
            value={searchText}
            onChange={({ target: { value } = {} } = {}) => setSearchText(value)}
          />
        </div>
      ) : null}
      {filteredItems.map((item) =>
        isMultiple ? (
          <div key={item.index} className={styles['dropdown-item']}>
            <Checkbox
              checked={isSelected(item.value)}
              onChange={({ target: { checked = false } = {} } = {}) =>
                checkedHandler(item.value, checked)
              }
              label={item.value}
              name={item.value}
            />
          </div>
        ) : (
          <div
            key={item.index}
            className={`${styles['dropdown-item']} ${
              isSelected(item.value) ? styles['highlighted'] : ''
            }`}
            onClick={(e) => clickHandler(e, item)}
          >
            {item.value}
          </div>
        )
      )}
    </div>
  );
};

Dropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      index: PropTypes.number,
    })
  ),
  hasSearch: PropTypes.bool,
  isMultiple: PropTypes.bool,
  selections: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};

export default Dropdown;
