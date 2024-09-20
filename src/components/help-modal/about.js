import React from 'react';
import PropTypes from 'prop-types';
import { HeadingText, BlockText, Link } from 'nr1';

const About = ({ appName, blurb, moreInfo }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <HeadingText type={HeadingText.TYPE.HEADING_3}>
        About {appName || 'this app'}
      </HeadingText>
      <BlockText>{blurb}</BlockText>
      {moreInfo && (
        <div style={{ paddingTop: '2px' }}>
          <Link to={moreInfo.link}>{moreInfo.text}</Link>
        </div>
      )}
    </div>
  );
};

About.propTypes = {
  appName: PropTypes.string,
  blurb: PropTypes.string.isRequired,
  moreInfo: PropTypes.shape({
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
};

export default About;
