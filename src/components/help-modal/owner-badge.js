import React from 'react';
import PropTypes from 'prop-types';
import { BlockText, Link } from 'nr1';

const getStyles = (className, styles, defaultStyles) => {
  if (className && !styles) return {};
  else return styles || defaultStyles;
};
const OwnerBadge = ({ logo, blurb, className, style, loading, setLoading }) => {
  return (
    <div
      className={className}
      style={getStyles(className, style, {
        marginTop: '10%',
        display: 'flex',
        alignItems: 'center',
      })}
    >
      {logo && (
        <img
          className={logo.className}
          style={getStyles(logo.className, logo.style, {
            height: '65px',
          })}
          src={logo.src}
          alt={logo.alt}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      )}
      {!loading && blurb && (
        <div
          className={blurb.className}
          style={getStyles(blurb.className, blurb.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          })}
        >
          <BlockText>{blurb.text}</BlockText>
          {blurb.link && <Link to={blurb.link.url}>{blurb.link.text}</Link>}
        </div>
      )}
    </div>
  );
};

OwnerBadge.propTypes = {
  logo: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
  }),
  blurb: PropTypes.shape({
    text: PropTypes.string,
    link: PropTypes.shape({
      text: PropTypes.string,
      url: PropTypes.string,
    }),
    style: PropTypes.object,
    className: PropTypes.string,
  }),
  style: PropTypes.object,
  className: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default OwnerBadge;
