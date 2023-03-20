import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Spinner } from 'nr1';
import About from './About';
import HelpLink from './HelpLink';
import OwnerBadge from './OwnerBadge';

const HelpModal = ({
  children,
  isModalOpen,
  setModalOpen,
  about,
  urls,
  ownerBadge
}) => {
  const [loadingBadge, setLoadingBadge] = useState(true);

  return (
    <Modal hidden={!isModalOpen} onClose={() => setModalOpen(false)}>
      {ownerBadge && loadingBadge ? (
        <Spinner />
      ) : (
        <>
          {about && <About {...about} />}
          {children}
          {urls.docs && (
            <HelpLink
              title="Open the Documentation"
              url={urls.docs}
              icon={Icon.TYPE.DOCUMENTS__DOCUMENTS__NOTES}
            />
          )}
          {urls.createIssue && (
            <HelpLink
              title="Report a Bug"
              url={urls.createIssue}
              icon={Icon.TYPE.INTERFACE__SIGN__EXCLAMATION__V_ALTERNATE}
            />
          )}
          {urls.createFeature && (
            <HelpLink
              title="Request a Feature"
              url={urls.createFeature}
              icon={Icon.TYPE.PROFILES__EVENTS__FAVORITE__WEIGHT_BOLD}
            />
          )}
          {urls.createQuestion && (
            <HelpLink
              title="Ask a question"
              url={urls.createQuestion}
              icon={Icon.TYPE.PROFILES__USERS__ORGANIZATION}
            />
          )}
        </>
      )}
      {ownerBadge && (
        <OwnerBadge
          {...ownerBadge}
          loading={loadingBadge}
          setLoading={setLoadingBadge}
        />
      )}
    </Modal>
  );
};

HelpModal.propTypes = {
  children: PropTypes.node,
  isModalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func.isRequired,
  about: PropTypes.shape({
    appName: PropTypes.string,
    blurb: PropTypes.string.isRequired,
    moreInfo: PropTypes.shape({
      link: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  }),
  urls: PropTypes.shape({
    docs: PropTypes.string,
    createIssue: PropTypes.string,
    createQuestion: PropTypes.string,
    createFeature: PropTypes.string
  }),
  ownerBadge: PropTypes.object
};

HelpModal.defaultProps = {
  isModalOpen: false
};

export default HelpModal;
