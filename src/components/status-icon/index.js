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

const StatusIcon = ({ status = STATUSES.UNKNOWN, color: backgroundColor }) => (
  <span
    className={`${styles['status-icon']} ${styles[status]}`}
    style={{ backgroundColor }}
  />
);

StatusIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUSES)),
  color: PropTypes.string,
};

StatusIcon.STATUSES = STATUSES;

export default StatusIcon;
