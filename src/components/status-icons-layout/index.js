import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import StatusIcon from '../status-icon';

import styles from './styles.scss';

const StatusIconsLayout = ({ statuses }) => {
  const [hexagons, setHexagons] = useState(null);
  const [width, setWidth] = useState(null);
  const wrapperRef = useRef();

  useEffect(() => {
    if (statuses) {
      setHexagons(
        statuses.map(({ style, ...statusProps }, i) => (
          <StatusIcon
            key={i}
            {...statusProps}
            style={{ style, margin: 1, marginBottom: -3 }}
          />
        ))
      );
    }
  }, [statuses]);

  useLayoutEffect(() => {
    const { width } = wrapperRef.current.getBoundingClientRect();
    setWidth(width);
  }, []);

  return (
    <div className={styles['status-icons-wrapper']} ref={wrapperRef}>
      <div className={styles['status-icons-container']} style={{ width }}>
        {width ? hexagons : null}
      </div>
    </div>
  );
};

StatusIconsLayout.propTypes = {
  statuses: PropTypes.array,
};

export default StatusIconsLayout;
