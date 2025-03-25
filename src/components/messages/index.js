import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SectionMessage, UserStorageQuery, UserStorageMutation } from 'nr1';
import dayjs from 'dayjs';

const COLLECTION_ID = 'USER_MSGS_CONFIG';
const DOCUMENT_ID = 'nerdpack_messages';
const getMessageId = (msg) => msg.date.concat(msg.desc.substring(0, 30));
const getMessageType = (level) => {
  switch (level) {
    case 'critical':
      return SectionMessage.TYPE.CRITICAL;
    case 'warning':
      return SectionMessage.TYPE.WARNING;
    default:
      return SectionMessage.TYPE.INFO;
  }
};
const getMessageActions = (msg, dismissMessage) => {
  const actions = [];
  msg.link && actions.push({ ...msg.link });
  actions.push({
    label: 'Dismiss this message',
    onClick: () => dismissMessage(msg),
  });
  return actions;
};
const isMessageActive = (msgDate, timeoutPeriod) =>
  dayjs().diff(dayjs(msgDate), 's') < timeoutPeriod;

const Messages = ({
  org,
  repo,
  branch,
  directory,
  fileName,
  timeoutPeriod,
  style,
  className,
}) => {
  const [messages, setMessages] = useState();
  const [dismissed, setDismissed] = useState();

  const loadMessages = useCallback(async () => {
    const loadConfig = async () => {
      const document = await UserStorageQuery.query({
        collection: COLLECTION_ID,
        documentId: DOCUMENT_ID,
      });
      const cfg = document?.data || {};
      setDismissed(cfg.dismissed || []);
      return cfg;
    };

    const fetchMessages = async () => {
      const file = `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${
        directory ? directory.concat('/') : ''
      }${fileName}.json`;

      const response = await fetch(file);
      if (!response.ok)
        // eslint-disable-next-line no-console
        console.error(`Error reading messages: ${response.status}`);

      const msgs = await response.json();
      return msgs.messages;
    };

    const filterMessages = (cfg, msgs) => {
      const filteredMessages = msgs
        .filter((m) => m.date && m.desc) // remove messages missing required attributes
        .filter((m) => isMessageActive(m.date, timeoutPeriod)) // remove old messages
        .filter((m) => {
          const dismissed = cfg?.dismissed || [];
          for (let z = 0; z < dismissed.length; z++) {
            if (getMessageId(m) === dismissed[z].id) {
              return false;
            }
          }
          return true;
        }); // remove messages previously dismissed by the user
      setMessages(filteredMessages);
    };

    loadConfig()
      .then((cfg) => fetchMessages().then((msgs) => filterMessages(cfg, msgs)))
      // eslint-disable-next-line no-console
      .catch((e) => console.error('error loading messages', e));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 86400000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const dismissMessage = async (msg) => {
    const id = getMessageId(msg);

    // remove the message from state
    setMessages((existingMessages) =>
      existingMessages.filter((m) => getMessageId(m) !== id)
    );

    // save the message as dismissed for this user
    const newDismissed = dismissed.filter((d) =>
      isMessageActive(d.date, timeoutPeriod)
    );
    newDismissed.push({ id, date: msg.date });
    try {
      await UserStorageMutation.mutate({
        actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: COLLECTION_ID,
        documentId: DOCUMENT_ID,
        document: { dismissed: newDismissed },
      });
      setDismissed(newDismissed);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error saving to nerdstorage', error);
    }
  };

  const useDefaultStyle = !className && !style;
  return (
    <>
      {messages &&
        messages.map((msg, idx) => {
          return (
            <SectionMessage
              className={className}
              style={useDefaultStyle ? { margin: '.5rem' } : style}
              key={idx}
              type={getMessageType(msg.level)}
              title={msg.title}
              description={`${msg.desc} [Posted ${msg.date}]`}
              actions={getMessageActions(msg, dismissMessage)}
            />
          );
        })}
    </>
  );
};

Messages.propTypes = {
  /* The github organization where the messages file is located. Default is newrelic */
  org: PropTypes.string,
  /* The name of the github repo where the messages file is located */
  repo: PropTypes.string.isRequired,
  /* The github branch where the file is located. Default is main */
  branch: PropTypes.string,
  /* Directory where the file is located. Default is repo root */
  directory: PropTypes.string,
  /* Filename without extension where messages will be found. Default is messages */
  fileName: PropTypes.string,
  /* Age in seconds after which Messages will not be displayed. Default is two weeks */
  timeoutPeriod: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

Messages.defaultProps = {
  org: 'newrelic',
  branch: 'main',
  fileName: 'messages',
  timeoutPeriod: 1210000,
};

export default Messages;
