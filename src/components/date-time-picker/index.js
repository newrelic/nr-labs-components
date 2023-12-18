import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from '../date-picker';
import TimePicker from '../time-picker';

import styles from './styles.scss';

const DateTimePicker = ({ datetime, validFrom, validTill, onChange }) => (
  <div className={styles['date-time-picker']}>
    <DatePicker date={datetime} onChange={onChange} validFrom={validFrom} />
    <TimePicker
      time={datetime}
      validFrom={validFrom}
      validTill={validTill}
      onChange={onChange}
    />
  </div>
);

DateTimePicker.propTypes = {
  datetime: PropTypes.instanceOf(Date),
  validFrom: PropTypes.instanceOf(Date),
  validTill: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};

export default DateTimePicker;
