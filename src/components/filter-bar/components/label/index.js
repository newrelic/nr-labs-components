import React from 'react';
import PropTypes from 'prop-types';

import { RemoveIcon } from '../../icons';

import styles from './styles.scss';

const Label = ({ value, onRemove }) => {
  const removeClickHandler = (evt) => {
    evt.stopPropagation();
    if (onRemove) onRemove(evt);
  };

  return (
    <span className={styles.label}>
      <span className={styles['label-text']}>{value}</span>
      <span className={styles['label-remove']} onClick={removeClickHandler}>
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
