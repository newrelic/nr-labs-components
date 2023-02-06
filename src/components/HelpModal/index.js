import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Spinner } from 'nr1';
import HelpLink from './HelpLink';
import OwnerBadge from './OwnerBadge';

const HelpModal = ({ isModalOpen, setModalOpen, urls, ownerBadge }) => {
  const [loadingBadge, setLoadingBadge] = useState(true);

  return (
    <Modal hidden={!isModalOpen} onClose={() => setModalOpen(false)}>
      {ownerBadge && loadingBadge ? (
        <Spinner />
      ) : (
        <>
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
  isModalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func.isRequired,
  urls: PropTypes.shape({
    docs: PropTypes.string,
    createIssue: PropTypes.string,
    createQuestion: PropTypes.string,
    createFeature: PropTypes.string,
  }),
  ownerBadge: PropTypes.object,
};

HelpModal.defaultProps = {
  isModalOpen: false,
};

export default HelpModal;
