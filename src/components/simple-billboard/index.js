import React from 'react';
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
  if (metric.value) {
    metric.value = Number(metric.value);
  }
  if (metric.previousValue) {
    metric.previousValue = Number(metric.previousValue);
  }

  const MetricStatus = (value) => {
    let metricStatus = (
      <Icon
        type={Icon.TYPE.INTERFACE__CARET__CARET_BOTTOM__WEIGHT_BOLD}
        color={'red'}
      />
    );
    metricStatus =
      value === 0 ? (
        <Icon
          type={Icon.TYPE.INTERFACE__CARET__CARET_RIGHT__WEIGHT_BOLD}
          color={'gold'}
        />
      ) : (
        metricStatus
      );
    metricStatus =
      value > 0 ? (
        <Icon
          type={Icon.TYPE.INTERFACE__CARET__CARET_TOP__WEIGHT_BOLD}
          color={'green'}
        />
      ) : (
        metricStatus
      );
    return <div className="metric-status">{metricStatus}</div>;
  };

  const formatValue = (metric) => {
    if (isNaN(metric.value)) return '-';
    let decimalCount = 1;
    let millar = 1000;
    let million = 1000000;
    let billion = 1000000000;
    let trillion = 1000000000000;
    if (!isNaN(metric.previousValue)) {
      decimalCount = 100;
      millar = 10;
      million = 10000;
      billion = 10000000;
      trillion = 10000000000;
    }

    if (metric.value > trillion)
      return `${Math.round(metric.value / trillion) / decimalCount} t`;
    else if (metric.value > billion)
      return `${Math.round(metric.value / billion) / decimalCount} b`;
    else if (metric.value > million)
      return `${Math.round(metric.value / million) / decimalCount} m`;
    else if (metric.value > millar)
      return `${Math.round(metric.value / millar) / decimalCount} k`;
    else return `${Math.round(metric.value * decimalCount) / decimalCount}`;
  };

  const renderMetric = (metric) => {
    if (!isNaN(metric.value)) {
      return (
        <div className="metric">
          {!prefix ? '' : prefix}
          {formatValue(metric)}
          {!suffix ? '' : ` ${suffix}`}
          {!isNaN(metric.previousValue) ? (
            <span>{MetricStatus(metric.value - metric.previousValue)}</span>
          ) : (
            ''
          )}
        </div>
      );
    }
  };
  /* eslint-disable prettier/prettier */
  return (
    <div>
      <div className="metric-content">
        <div
          className={`metric-content--colorblack metric-content--size1_6em metric-content--weight900 ${!className ? '' : className}`}
          style={!style ? {emptyStyle: ' '} : style}
        >
          {renderMetric(metric)}
        </div>
        <div
          className={`metric-content--colorblack metric-content--size1_6em ${!className ? '' : className}`}
          style={!style ? {emptyStyle: ' '} : style}
        >
          {metric.name}
        </div>
      </div>
    </div>
  );
  /* eslint-enable prettier/prettier */
};

SimpleBillboard.propTypes = {
  metric: PropTypes.object,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SimpleBillboard;
