import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'nr1';

import styles from './styles.scss';

/**
 * @param {Object} metric - metric value, previousValue, optional: prefix, suffix, className, style
 * @param {Object} statusTrend - optional: className, style
 * @param {Object} title - metric name, optional: className, style
 * @return {JSX Object} - RENDERING name, value, up/down trend when previousValue present
 */
const SimpleBillboard = ({ metric, statusTrend = {}, title }) => {
  const metricValue = useMemo(
    () => (isNaN(metric.value) ? '-' : Number(metric.value)),
    [metric.value]
  );

  const metricPreviousValue = useMemo(
    () =>
      isNaN(metric.previousValue) || metric.previousValue === ''
        ? '-'
        : Number(metric.previousValue),
    [metric.previousValue]
  );

  const difference = useMemo(
    () =>
      typeof metricValue === 'number' && typeof metricPreviousValue === 'number'
        ? metricValue - metricPreviousValue
        : 0,
    [metricValue, metricPreviousValue]
  );

  const formattedValue = useMemo(() => {
    if (metricValue === '-') return '-';
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;

    const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    if (metricValue > trillion) return `${round(metricValue / trillion)} t`;
    else if (metricValue > billion) return `${round(metricValue / billion)} b`;
    else if (metricValue > million) return `${round(metricValue / million)} m`;
    else if (metricValue > thousand)
      return `${round(metricValue / thousand)} k`;
    else return `${round(metricValue)}`;
  }, [metricValue, metricPreviousValue]);

  const changeStatus = useMemo(() => {
    if (difference === 0) return null;
    const icons = {
      uparrow: <polygon points="8,0 0,16 16,16" />,
      downarrow: <polygon points="0,0 16,0 8,16" />,
    };
    const icon =
      difference > 0
        ? {
            type: 'uparrow',
            fill: '#02865B',
          }
        : {
            type: 'downarrow',
            fill: '#DF2D24',
          };
    return (
      <svg
        className={`${styles['metric-status']} ${statusTrend.className || ''}`}
        style={{ ...statusTrend.style } || {}}
        viewBox="0 0 16 16"
        fill={icon.fill}
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="img"
      >
        <title>{`${icon.type} icon`}</title>
        {icons[icon.type]}
      </svg>
    );
  }, [difference]);

  return (
    <>
      <div
        className={`${styles['metric-color']} ${styles['metric-value']} ${
          metric.className || ''
        }`}
        style={metric.style || {}}
      >
        {`${metric.prefix || ''} ${formattedValue} ${metric.suffix || ''}`}
        <span>{changeStatus}</span>
      </div>

      <Tooltip text={title.name}>
        <div
          className={`${styles['metric-color']} ${styles['metric-name']} ${
            title.className || ''
          }`}
          style={{ ...title.style } || {}}
        >
          {title.name}
        </div>
      </Tooltip>
    </>
  );
};

SimpleBillboard.propTypes = {
  metric: PropTypes.shape({
    value: PropTypes.number,
    previousValue: PropTypes.number,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }),
  statusTrend: PropTypes.shape({
    className: PropTypes.string,
    style: PropTypes.object,
  }),
  title: PropTypes.shape({
    name: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
  }),
};

export default SimpleBillboard;
