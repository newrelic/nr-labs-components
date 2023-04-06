import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'nr1';

/**
 * @param {Object} metric - metric name, value, previousCalue
 * @param {string} prefix - prefix for metric.value (i.e. '$')
 * @param {string} suffix - suffix for metric.value (i.e. users)
 * @param {string} className -  SCSS class name - gets added to existing JSX classes
 * @param {Object} style - SCSS style - gets added to JSX - overwrites existing/duplicate CSS properties
 * @return {JSX Object} - RENDERING name, value, up/down trend when previousValue present
 */
const SimpleBillboard = ({ metric, prefix, suffix, className, style }) => {
  const metricValue = useMemo(
    () => (isNaN(metric.value) ? '-' : Number(metric.value), [metric.value])
  );
  const metricPreviousValue = useMemo(
    () => (
      isNaN(metric.previousValue) ? '-' : Number(metric.previousValue),
      [metric.previousValue]
    )
  );

  const MetricStatus = useCallback(
    (difference) => {
      let attributes = {
        type: Icon.TYPE.INTERFACE__CARET__CARET_BOTTOM__WEIGHT_BOLD,
        color: 'red',
      };
      if (difference === 0) {
        attributes = {
          type: Icon.TYPE.INTERFACE__CARET__CARET_RIGHT__WEIGHT_BOLD,
          color: 'gold',
        };
      } else if (difference > 0) {
        attributes = {
          type: Icon.TYPE.INTERFACE__CARET__CARET_TOP__WEIGHT_BOLD,
          color: 'green',
        };
      }
      return (
        <div className="metric-status">
          <Icon {...attributes} />
        </div>
      );
    },
    [metricValue - metricPreviousValue]
  );

  const formatValue = useMemo(() => {
    if (isNaN(metricValue)) return '-';
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    const decimalFactor = !isNaN(metricPreviousValue) ? 100 : 1;

    const round = (value) =>
      Math.round((value + Number.EPSILON) * decimalFactor) / decimalFactor;

    if (metricValue > trillion) return `${round(metricValue / trillion)} t`;
    else if (metricValue > billion) return `${round(metricValue / billion)} b`;
    else if (metricValue > million) return `${round(metricValue / million)} m`;
    else if (metricValue > thousand)
      return `${round(metricValue / thousand)} k`;
    else return `${round(metricValue)}`;
  }, [metric]);

  const renderMetric = () => {
    if (!isNaN(metricValue)) {
      return (
        <div className="metric">
          {!prefix ? '' : prefix}
          {formatValue}
          {!suffix ? '' : ` ${suffix}`}
          {!isNaN(metricPreviousValue) ? (
            <span>{MetricStatus(metricValue - metricPreviousValue)}</span>
          ) : (
            ''
          )}
        </div>
      );
    }
  };
  return (
    <div>
      <div className="metric-content">
        <div
          className={`metric-content--colorblack metric-content--size1_2em metric-content--weight900 ${
            className || ''
          }`}
          style={style || {}}
        >
          {renderMetric()}
        </div>
        <div
          className={`metric-content--colorblack metric-content--size1_2em ${
            className || ''
          }`}
          style={style || {}}
        >
          {metric.name}
        </div>
      </div>
    </div>
  );
};

SimpleBillboard.propTypes = {
  metric: PropTypes.object,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SimpleBillboard;
