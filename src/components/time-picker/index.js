import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Popover,
  PopoverTrigger,
  PopoverBody,
  TextField,
  List,
  ListItem,
  Button,
} from 'nr1';

import {
  getHourMinuteFromTimeString,
  isValidTime,
  normalizedDateTime,
  isHourMinuteNumbers,
} from './utils';

import styles from './styles.scss';

const TIME_FORMATTER = new Intl.DateTimeFormat('default', {
  hour12: true,
  hour: 'numeric',
  minute: 'numeric',
});

const TIMES_LIST = Array.from({ length: 48 }).map((_, i) => ({
  key: `time${i}`,
  value:
    `${Math.floor(i / 2) % 12 || 12}`.padStart(2, '0') +
    `:${i % 2 ? '30' : '00'} ${i > 23 ? 'pm' : 'am'}`,
}));

const TimePicker = ({ time, validFrom, validTill, onChange }) => {
  const [opened, setOpened] = useState(false);
  const [filter, setFilter] = useState('');
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (!filter) {
      setTimes(
        TIMES_LIST.filter(({ value }) =>
          isValidTime(value, validFrom, validTill, time)
        )
      );
      return;
    }
    const re = /^(1[0-2]|0?[1-9]):?([0-5]?[0-9])? ?([AaPp][Mm]?)?/;
    const [, hr, mi, me] = filter.match(re) || [];

    if (hr) {
      let reStr = hr;
      if (reStr.length === 1 && Number(hr) < 3) reStr += '[0-9]?';
      reStr += mi ? `:${mi}` : ':[0-9][0-9]';
      if (reStr && me && /^[Aa]/.test(me)) reStr += ' am';
      if (reStr && me && /^[Pp]/.test(me)) reStr += ' pm';

      const re2 = new RegExp(reStr);
      const matches = TIMES_LIST.filter(
        ({ value }) =>
          value.match(re2) && isValidTime(value, validFrom, validTill, time)
      );
      if (!matches.length && hr && mi && mi.length === 2) {
        if (me && /^[AaPp]/.test(me)) {
          const value = `${hr}:${mi} ${/^[Aa]/.test(me) ? 'am' : 'pm'}`;
          if (isValidTime(value, validFrom, validTill, time))
            matches.push({
              key: 'time48',
              value,
            });
        } else {
          ['am', 'pm'].forEach((m) => {
            const value = `${hr}:${mi} ${m}`;
            if (isValidTime(value, validFrom, validTill, time))
              matches.push({
                key: `time48${m}`,
                value,
              });
          });
        }
      }
      setTimes(matches);
    }
  }, [filter]);

  const clickHandler = useCallback((e, t) => {
    e.stopPropagation();
    const { hr, mi } = getHourMinuteFromTimeString(t);
    if (!isHourMinuteNumbers(hr, mi)) return;
    if (onChange) onChange(normalizedDateTime(time, hr, mi));
    setOpened(false);
    setFilter('');
  }, []);

  const changeHandler = useCallback((_, o) => {
    if (!o) setFilter('');
    setOpened(o);
  });

  const filterChangeHandler = useCallback(
    ({ target: { value = '' } } = {}) => setFilter(value),
    []
  );

  const keyDownHandler = useCallback((e) => {
    const re = /[0-9APMapm: ]+/g;
    if (!re.test(e.key)) e.preventDefault();
  }, []);

  return (
    <Popover opened={opened} onChange={changeHandler}>
      <PopoverTrigger>
        <TextField
          className={styles['time-picker-text-field']}
          value={
            time instanceof Date
              ? TIME_FORMATTER.format(time).toLocaleLowerCase()
              : ''
          }
          placeholder="Select time"
          readOnly
        />
      </PopoverTrigger>
      <PopoverBody>
        <div className={styles['time-picker']}>
          <TextField
            className={styles['time-list-search']}
            type={TextField.TYPE.SEARCH}
            placeholder="filter..."
            value={filter}
            onKeyDown={keyDownHandler}
            onChange={filterChangeHandler}
          />
          <List className={styles['time-list-items']}>
            {times.map(({ key, value }) => (
              <ListItem key={key}>
                <Button
                  className={styles['time-list-item']}
                  type={Button.TYPE.PLAIN}
                  onClick={(e) => clickHandler(e, value)}
                >
                  {value}
                </Button>
              </ListItem>
            ))}
          </List>
        </div>
      </PopoverBody>
    </Popover>
  );
};

TimePicker.propTypes = {
  time: PropTypes.instanceOf(Date),
  validFrom: PropTypes.instanceOf(Date),
  validTill: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};

export default TimePicker;
