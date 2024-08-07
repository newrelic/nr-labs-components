import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Icon, Popover, PopoverTrigger, PopoverBody, TextField } from 'nr1';

import {
  formattedDateField,
  formattedMonthYear,
  firstDayOfMonth,
  lastDateInMonth,
  extractDateParts,
  selectedDate,
  daysOfWeek,
  isSelectableDate,
} from './utils';

const DAYS_OF_WEEK = daysOfWeek();

import styles from './styles.scss';

const DatePicker = ({ date, validFrom, onChange }) => {
  const [opened, setOpened] = useState(false);
  const [current, setCurrent] = useState(extractDateParts(new Date()));

  useEffect(() => {
    if (!date || !(date instanceof Date)) return;
    setCurrent(extractDateParts(date));
  }, [date]);

  const prevMonth = () => {
    const prevMo = new Date(current.yr, current.mo - 1);
    setCurrent(extractDateParts(prevMo));
  };

  const nextMonth = () => {
    const nextMo = new Date(current.yr, current.mo + 1);
    setCurrent(extractDateParts(nextMo));
  };

  const isDateInCurrentMonth = useCallback(
    (d = new Date()) =>
      d.getFullYear() === current.yr && d.getMonth() === current.mo,
    [current]
  );

  const clickHandler = useCallback(
    (e, dt) => {
      e.stopPropagation();
      if (!isSelectableDate(current, dt + 1, validFrom) || !onChange) return;

      const d = date instanceof Date ? new Date(date.getTime()) : new Date();
      d.setFullYear(current.yr);
      d.setMonth(current.mo);
      d.setDate(dt + 1);
      onChange(d);

      setOpened(false);
    },
    [current, date, validFrom]
  );

  const changeHandler = useCallback((_, o) => setOpened(o), []);

  return (
    <Popover opened={opened} onChange={changeHandler}>
      <PopoverTrigger>
        <TextField
          className="date-picker-text-field"
          value={formattedDateField(date)}
          placeholder="Select a date"
          readOnly
        />
      </PopoverTrigger>
      <PopoverBody>
        <div className={`${styles.calendar}`}>
          <div className={`${styles.cell} ${styles.prev}`} onClick={prevMonth}>
            <Icon type={Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_LEFT} />
          </div>
          <div className={`${styles.cell} ${styles['mo-yr']}`}>
            {formattedMonthYear(new Date(current.yr, current.mo))}
          </div>
          <div
            className={`${styles.cell} ${
              isDateInCurrentMonth() ? styles.disabled : styles.next
            }`}
            onClick={isDateInCurrentMonth() ? null : nextMonth}
          >
            <Icon type={Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_RIGHT} />
          </div>
          {DAYS_OF_WEEK.map(({ long, short }) => (
            <div className={`${styles.cell} ${styles.day}`} key={long}>
              <abbr title={long}>{short}</abbr>
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth(current) }, (_, i) => (
            <div
              key={`${current.yr}${current.mo}blank${i}`}
              className={`${styles.cell}`}
            />
          ))}
          {Array.from({ length: lastDateInMonth(current) }, (_, i) => (
            <div
              key={`${current.yr}${current.mo}${i}`}
              className={`${styles.cell} ${styles.date} ${
                selectedDate(i, current, date) ? styles.selected : ''
              } ${
                !isSelectableDate(current, i + 1, validFrom)
                  ? styles.disabled
                  : ''
              }`}
              onClick={(e) => clickHandler(e, i)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </PopoverBody>
    </Popover>
  );
};

DatePicker.propTypes = {
  date: PropTypes.instanceOf(Date),
  validFrom: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};

export default DatePicker;
