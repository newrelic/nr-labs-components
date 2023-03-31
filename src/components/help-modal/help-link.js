import React from 'react';
import PropTypes from 'prop-types';
import { HeadingText, Tile, Icon, Spacing } from 'nr1';

const HelpLink = ({ title, icon, url }) => (
  <Spacing type={[Spacing.TYPE.LARGE, Spacing.TYPE.OMIT]}>
    <Tile onClick={() => window.open(url, '_blank')}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon type={icon} />
        <Spacing type={[Spacing.TYPE.OMIT, Spacing.TYPE.MEDIUM]}>
          <HeadingText type={HeadingText.TYPE.HEADING_5}>{title}</HeadingText>
        </Spacing>
      </div>
    </Tile>
  </Spacing>
);

HelpLink.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default HelpLink;
