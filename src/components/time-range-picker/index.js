import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  Popover,
  PopoverTrigger,
  PopoverBody,
  List,
  ListItem,
  Button,
} from 'nr1';

import DateTimePicker from '../date-time-picker';

import styles from './styles.scss';

const TEXTS = {
  APPLY: 'Apply',
  CANCEL: 'Cancel',
  CUSTOM: 'Custom',
  DEFAULT: 'Default',
};

const TIME_RANGES = [
  { label: TEXTS.DEFAULT, offset: null },
  { break: true },
  { label: '30 minutes', offset: 1000 * 60 * 30 },
  { label: '60 minutes', offset: 1000 * 60 * 60 },
  { break: true },
  { label: '3 hours', offset: 1000 * 60 * 60 * 3 },
  { label: '6 hours', offset: 1000 * 60 * 60 * 6 },
  { label: '24 hours', offset: 1000 * 60 * 60 * 24 },
  { break: true },
  { label: '3 days', offset: 1000 * 60 * 60 * 24 * 3 },
  { label: '7 days', offset: 1000 * 60 * 60 * 24 * 7 },
  { break: true },
];

const normalizedDateTime = (dt = new Date()) =>
  new Date(
    dt.getFullYear(),
    dt.getMonth(),
    dt.getDate(),
    dt.getHours(),
    dt.getMinutes()
  );

const TimeRangePicker = ({ timeRange, onChange }) => {
  const [opened, setOpened] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [beginTime, setBeginTime] = useState();
  const [endTime, setEndTime] = useState();

  useEffect(() => {
    if (!timeRange) {
      setSelected(TEXTS.DEFAULT);
      setBeginTime(null);
      setEndTime(null);
    } else if (timeRange.duration) {
      setSelected(
        TIME_RANGES.find((tr) => tr.offset === timeRange.duration)?.label ||
          TEXTS.DEFAULT
      );
      setBeginTime(null);
      setEndTime(null);
    } else {
      setSelected(TEXTS.CUSTOM);
      const { begin_time, end_time } = timeRange;
      let b, e;
      try {
        b = begin_time instanceof Date ? begin_time : new Date(begin_time);
        e = end_time instanceof Date ? end_time : new Date(end_time);
      } catch (_) {
        // continue regardless of error
      }
      if (b && e) {
        setBeginTime(b);
        setEndTime(e);
      }
    }
  }, [timeRange]);

  const setDurationHandler = (duration) => {
    if (onChange)
      onChange(
        duration
          ? {
              begin_time: null,
              duration,
              end_time: null,
            }
          : null
      );
    setOpened(false);
    setBeginTime(null);
    setEndTime(null);
    setIsCustomOpen(false);
  };

  const changeHandler = useCallback((_, o) => {
    if (!o) {
      setBeginTime(null);
      setEndTime(null);
      setIsCustomOpen(false);
    }
    setOpened(o);
  }, []);

  const toggleCustomHandler = () => {
    if (!isCustomOpen) {
      if (timeRange && timeRange['begin_time'] && timeRange['end_time']) {
        setBeginTime(timeRange['begin_time']);
        setEndTime(timeRange['end_time']);
      } else {
        const thirtyMinsAgo = new Date();
        thirtyMinsAgo.setMinutes(thirtyMinsAgo.getMinutes() - 30);
        setEndTime(normalizedDateTime());
        setBeginTime(normalizedDateTime(thirtyMinsAgo));
      }
    }
    setIsCustomOpen((c) => !c);
  };

  const setCustomHandler = useCallback(() => {
    if (onChange)
      onChange({
        begin_time: beginTime instanceof Date ? beginTime.getTime() : beginTime,
        duration: null,
        end_time: endTime instanceof Date ? endTime.getTime() : endTime,
      });
    setOpened(false);
  }, [beginTime, endTime]);

  const cancelCustomHandler = useCallback((e) => {
    e.stopPropagation();
    setIsCustomOpen(false);
  }, []);

  return (
    <Popover opened={opened} onChange={changeHandler}>
      <PopoverTrigger>
        <Button
          className={styles['time-range-picker-button']}
          type={Button.TYPE.PLAIN}
          sizeType={Button.SIZE_TYPE.SMALL}
        >
          <Icon type={Icon.TYPE.DATE_AND_TIME__DATE_AND_TIME__TIME} />
          {selected}
          <Icon
            className={styles['button-chevron']}
            type={
              opened
                ? Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_TOP
                : Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_BOTTOM
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverBody>
        <div className={styles['time-range-list']}>
          <List className={styles['time-range-list-items']}>
            {TIME_RANGES.map((tr, i) => (
              <ListItem key={i}>
                {tr.break ? (
                  <hr className={styles['time-range-list-break']} />
                ) : (
                  <Button
                    className={`${styles['time-range-list-item']} ${
                      tr.label === selected ? styles.open : ''
                    }`}
                    type={Button.TYPE.PLAIN}
                    onClick={() => setDurationHandler(tr.offset)}
                  >
                    {tr.label}
                  </Button>
                )}
              </ListItem>
            ))}
            <ListItem>
              <Button
                className={`${styles['time-range-list-item']} ${
                  styles.custom
                } ${
                  isCustomOpen || selected === TEXTS.CUSTOM ? styles.open : ''
                }`}
                type={Button.TYPE.PLAIN}
                onClick={toggleCustomHandler}
              >
                {TEXTS.CUSTOM}
                <Icon
                  className={styles['button-chevron']}
                  type={
                    isCustomOpen || selected === TEXTS.CUSTOM
                      ? Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_TOP
                      : Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_BOTTOM
                  }
                />
              </Button>
              {isCustomOpen ? (
                <div className={styles['custom-entry']}>
                  <DateTimePicker
                    datetime={beginTime}
                    onChange={setBeginTime}
                  />
                  <DateTimePicker
                    datetime={endTime}
                    onChange={setEndTime}
                    validFrom={beginTime}
                    validTill={normalizedDateTime()}
                  />
                  <div className={styles['custom-buttons']}>
                    <Button
                      type={Button.TYPE.PRIMARY}
                      sizeType={Button.SIZE_TYPE.SMALL}
                      onClick={setCustomHandler}
                    >
                      {TEXTS.APPLY}
                    </Button>
                    <Button
                      type={Button.TYPE.PLAIN}
                      sizeType={Button.SIZE_TYPE.SMALL}
                      onClick={cancelCustomHandler}
                    >
                      {TEXTS.CANCEL}
                    </Button>
                  </div>
                </div>
              ) : null}
            </ListItem>
          </List>
        </div>
      </PopoverBody>
    </Popover>
  );
};

TimeRangePicker.propTypes = {
  timeRange: PropTypes.shape({
    begin_time: PropTypes.number,
    duration: PropTypes.number,
    end_time: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default TimeRangePicker;
