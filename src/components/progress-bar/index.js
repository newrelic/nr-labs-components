import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { STATUSES } from '../../constants';

import classes from './styles.scss';

const percentFormatter = new Intl.NumberFormat('default', {
  style: 'percent',
  maximumFractionDigits: 2,
});

const ProgressBar = ({
  max = 0,
  value = 0,
  status,
  onEnd,
  label,
  fontSize,
  fontColor: color,
  fontWeight,
  backgroundColor,
  barColor,
  height,
}) => {
  const progressBar = useRef(null);

  useEffect(() => {
    const progressPct =
      max && value ? percentFormatter.format(value / max) : '0px';
    progressBar.current.style.width = progressPct;
  }, [max, value]);

  const transitionHandler = () => {
    if (value === max && onEnd) onEnd();
  };

  return (
    <div
      className={`${classes['progress']}`}
      style={{ backgroundColor, height }}
    >
      <div
        className={`${classes['counter']} ${classes[status]}`}
        style={{
          ...(onEnd && { transition: 'width 3s' }),
          backgroundColor: barColor,
          height,
        }}
        ref={progressBar}
        onTransitionEnd={transitionHandler}
      >
        {label && (
          <span
            style={{
              paddingLeft: '5px',
              lineHeight: height,
              fontSize,
              color,
              fontWeight,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

ProgressBar.STATUSES = STATUSES;
ProgressBar.propTypes = {
  max: PropTypes.number,
  value: PropTypes.number,
  status: PropTypes.oneOf(Object.values(STATUSES)),
  onEnd: PropTypes.func,
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  barColor: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.string,
  fontColor: PropTypes.string,
  fontWeight: PropTypes.string,
};

export default ProgressBar;
