import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const STATUSES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
};

const StatusIcon = ({ status = STATUSES.UNKNOWN }) => (
  <span className={`${styles['status-icon']} ${styles[status]}`} />
);

StatusIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUSES)),
};

StatusIcon.STATUSES = STATUSES;

export default StatusIcon;
