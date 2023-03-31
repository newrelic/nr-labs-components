import {
  MINUTE,
  HOUR,
  DAY,
  SINCE,
  UNTIL,
  DEFAULT_30_MINS_AGO,
  MINUTES_AGO,
  HOURS_AGO,
  DAYS_AGO,
} from './constants';

const validTimeRange = (timeRange) => {
  return (
    timeRange.duration ||
    (timeRange.beginTime && timeRange.endTime) ||
    (timeRange.begin_time && timeRange.end_time)
  );
};
export const timeRangeToNrql = function ({ timeRange = false }) {
  if (!timeRange || !validTimeRange(timeRange)) {
    return DEFAULT_30_MINS_AGO;
  }

  if (timeRange.beginTime && timeRange.endTime) {
    return `${SINCE} ${timeRange.beginTime} ${UNTIL} ${timeRange.endTime}`;
  } else if (timeRange.begin_time && timeRange.end_time) {
    return `${SINCE} ${timeRange.begin_time} ${UNTIL} ${timeRange.end_time}`;
  } else if (timeRange.duration <= HOUR) {
    return `${SINCE} ${timeRange.duration / MINUTE} ${MINUTES_AGO}`;
  } else if (timeRange.duration <= DAY) {
    return `${SINCE} ${timeRange.duration / HOUR} ${HOURS_AGO}`;
  } else {
    return `${SINCE} ${timeRange.duration / DAY} ${DAYS_AGO}`;
  }
};
