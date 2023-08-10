import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Conjunction = ({ operator, isHint, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const thisComponent = useRef();

  useEffect(() => {
    function handleClicksOutsideComponent(evt) {
      if (
        showPicker &&
        thisComponent &&
        !thisComponent.current.contains(evt.target)
      )
        setShowPicker(false);
    }
    document.addEventListener('mousedown', handleClicksOutsideComponent);

    return function cleanup() {
      document.removeEventListener('mousedown', handleClicksOutsideComponent);
    };
  });

  const clickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setShowPicker(!showPicker);
  };

  const changeHandler = (selection, evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (onChange && selection !== operator) onChange(selection);
  };

  const options = ['AND', 'OR'];

  return (
    <span
      className={`${styles.conjunction} ${isHint ? styles.hint : ''}`}
      onClick={clickHandler}
      ref={thisComponent}
    >
      {operator}
      {showPicker && (
        <span className={styles['conjunction-picker']}>
          {options.map((opt, i) => (
            <span
              key={i}
              className={opt === operator ? styles.selected : ''}
              onClick={(evt) => changeHandler(opt, evt)}
            >
              {opt}
            </span>
          ))}
        </span>
      )}
    </span>
  );
};

Conjunction.propTypes = {
  operator: PropTypes.string,
  isHint: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Conjunction;
