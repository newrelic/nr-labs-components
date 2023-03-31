import { timeRangeToNrql } from '.';
import {
  SINCE,
  UNTIL,
  DEFAULT_30_MINS_AGO,
  MINUTES_AGO,
  HOURS_AGO,
  DAYS_AGO,
} from './constants';

test('missing timerange returns 30 mins', () => {
  expect(timeRangeToNrql({})).toBe(DEFAULT_30_MINS_AGO);
});

test('empty timerange returns 30 mins', () => {
  expect(timeRangeToNrql({ timeRange: {} })).toBe(DEFAULT_30_MINS_AGO);
});

test('conversion of beginTime and endTime', () => {
  const beginTime = '2 days ago';
  const endTime = '1 day ago';
  expect(timeRangeToNrql({ timeRange: { beginTime, endTime } })).toBe(
    `${SINCE} ${beginTime} ${UNTIL} ${endTime}`
  );
});

test('conversion of begin_time and end_time', () => {
  const begin_time = '2 days ago';
  const end_time = '1 day ago';
  expect(timeRangeToNrql({ timeRange: { begin_time, end_time } })).toBe(
    `${SINCE} ${begin_time} ${UNTIL} ${end_time}`
  );
});

test('conversion of duration ms to minutes', () => {
  const duration = 3540000;
  const expectedDurationInMinutes = 59;
  expect(timeRangeToNrql({ timeRange: { duration } })).toBe(
    `${SINCE} ${expectedDurationInMinutes} ${MINUTES_AGO}`
  );
});

test('conversion of duration ms to hours', () => {
  const duration = 10800000;
  const expectDurationInHours = 3;
  expect(timeRangeToNrql({ timeRange: { duration } })).toBe(
    `${SINCE} ${expectDurationInHours} ${HOURS_AGO}`
  );
});

test('conversion of duration ms to days', () => {
  const duration = 259200000;
  const expectedDurationInDays = 3;
  expect(timeRangeToNrql({ timeRange: { duration } })).toBe(
    `${SINCE} ${expectedDurationInDays} ${DAYS_AGO}`
  );
});
