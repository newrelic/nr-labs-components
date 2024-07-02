import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  List,
  ListItem,
  Popover,
  PopoverTrigger,
  PopoverBody,
  Tooltip,
} from 'nr1';

import DateTimePicker from '../date-time-picker';

import styles from './styles.scss';

const TEXTS = {
  APPLY: 'Apply',
  CANCEL: 'Cancel',
  CUSTOM: 'Custom',
  DEFAULT: 'Default',
  SELECT: 'Select',
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

const normalizedDateTime = (dt = new Date()) => new Date(dt.setSeconds(0, 0));

const formattedText = (num, txt) => {
  if (!num || !txt) return '';
  return `${num} ${txt}${num > 1 ? 's' : ''}`;
};

const displayMins = (minutes) => {
  if (!minutes) return '';
  const minsInHour = 60,
    minsInDay = 60 * 24;
  if (minutes < minsInHour) return formattedText(minutes, 'minute');
  const mins = minutes % minsInHour;
  if (minutes < minsInDay) {
    const hours = Math.floor(minutes / minsInHour);
    return `${formattedText(hours, 'hour')} ${formattedText(mins, 'minute')}`;
  }
  const days = Math.floor(minutes / minsInDay);
  const hours = Math.floor((minutes - days * minsInDay) / minsInHour);
  return `${formattedText(days, 'day')} ${formattedText(
    hours,
    'hour'
  )} ${formattedText(mins, 'minute')}`;
};

const TimeRangePicker = ({
  timeRange,
  maxRangeMins,
  hideDefault,
  onChange,
}) => {
  const [opened, setOpened] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customSaveDisabled, setCustomSaveDisabled] = useState(true);
  const [selected, setSelected] = useState('');
  const [beginTime, setBeginTime] = useState();
  const [endTime, setEndTime] = useState();
  const [filteredTimeRanges, setFilteredTimeRanges] = useState(TIME_RANGES);

  useEffect(
    () =>
      setFilteredTimeRanges(() => {
        if (!hideDefault && !maxRangeMins) return TIME_RANGES;
        return TIME_RANGES.reduce((acc, tr, idx) => {
          if (hideDefault && idx < 2) return acc;
          if (
            (tr.break && !acc[acc.length - 1]?.break) ||
            !maxRangeMins ||
            tr.offset / 60000 <= maxRangeMins
          )
            return [...acc, tr];
          return acc;
        }, []);
      }),
    [maxRangeMins, hideDefault]
  );

  useEffect(() => {
    const fallbackTimeRangeLabel = hideDefault ? TEXTS.SELECT : TEXTS.DEFAULT;
    if (!timeRange) {
      setSelected(fallbackTimeRangeLabel);
      setBeginTime(null);
      setEndTime(null);
    } else if (timeRange.duration) {
      setSelected(
        filteredTimeRanges.find((tr) => tr.offset === timeRange.duration)
          ?.label || fallbackTimeRangeLabel
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
  }, [timeRange, filteredTimeRanges, hideDefault]);

  useEffect(() => {
    if (!beginTime || !endTime) {
      setCustomSaveDisabled(true);
    } else if (maxRangeMins && (endTime - beginTime) / 60000 > maxRangeMins) {
      setCustomSaveDisabled(true);
    } else {
      setCustomSaveDisabled(false);
    }
  }, [beginTime, endTime, maxRangeMins]);

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
            {filteredTimeRanges.map((tr, i) => (
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
                    <Tooltip
                      text={
                        customSaveDisabled
                          ? `Only up to ${displayMins(maxRangeMins)} allowed`
                          : ''
                      }
                    >
                      <Button
                        type={Button.TYPE.PRIMARY}
                        sizeType={Button.SIZE_TYPE.SMALL}
                        disabled={customSaveDisabled}
                        onClick={setCustomHandler}
                      >
                        {TEXTS.APPLY}
                      </Button>
                    </Tooltip>
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
  maxRangeMins: PropTypes.number,
  hideDefault: PropTypes.bool,
  onChange: PropTypes.func,
};

export default TimeRangePicker;
