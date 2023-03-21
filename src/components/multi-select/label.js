import React from 'react';
import PropTypes from 'prop-types';

import RemoveIcon from './remove.svg';

import styles from './label.scss';

const Label = ({ value, onRemove }) => {
  const removeClickHandler = (evt) => {
    evt.stopPropagation();
    if (onRemove) onRemove(evt);
  };

  return (
    <span className={styles.label}>
      <span className={styles.text}>{value}</span>
      <span className={styles.remove} onClick={removeClickHandler}>
        <img src={RemoveIcon} alt="remove" />
      </span>
    </span>
  );
};

Label.propTypes = {
  value: PropTypes.string,
  onRemove: PropTypes.func,
};

export default Label;
