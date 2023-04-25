import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const STATUSES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
  BLANK: 'blank',
};

const StatusIcon = ({
  status = STATUSES.UNKNOWN,
  style,
  color: backgroundColor,
  onClick,
  title = '',
}) => (
  <span
    title={title}
    className={`${styles['status-icon']} ${styles[status]}`}
    style={{
      ...(onClick ? { cursor: 'pointer' } : {}),
      ...style,
      backgroundColor,
    }}
    onClick={onClick}
  />
);

StatusIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUSES)),
  style: PropTypes.object,
  color: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

StatusIcon.STATUSES = STATUSES;

export default StatusIcon;
