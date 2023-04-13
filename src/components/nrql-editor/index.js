import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { AccountPicker } from 'nr1';

import patterns from './patterns';

import styles from './index.scss';

const lexer = (nrql) =>
  patterns.reduce(
    (acc, { name, regex } = {}) =>
      acc.replace(regex, (match) => `<span class="${name}">${match}</span>`),
    nrql
  );

const NrqlEditor = ({
  query = 'SELECT * FROM Transaction',
  accountId,
  onSave,
  saveButtonText = 'Run',
}) => {
  const [nrql, setNrql] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState();
  const [displayNode, setDisplayNode] = useState();

  useEffect(() => setSelectedAccountId(accountId), [accountId]);

  useEffect(() => setNrql(query), [query]);

  const scrollHandler = useCallback(
    ({ target: { scrollTop = 0 } = {} } = {}) => {
      if (displayNode) displayNode.scrollTop = scrollTop;
    },
    [displayNode]
  );

  const displayNodeHandler = useCallback((node) => setDisplayNode(node), []);

  const saveHandler = useCallback(() => {
    if (onSave) onSave({ query: nrql, accountId: selectedAccountId });
  }, [nrql, selectedAccountId, onSave]);

  const keyDownHandler = useCallback(
    (e) => {
      const { keyCode, shiftKey } = e;
      if (keyCode === 13 && !shiftKey) {
        e.preventDefault();
        saveHandler();
      }
    },
    [saveHandler]
  );

  return (
    <div className={styles['nrql-editor']}>
      <div className={styles['account-picker']}>
        <AccountPicker
          value={selectedAccountId}
          onChange={(_, value) => setSelectedAccountId(value)}
        />
      </div>
      <div className={styles['color-coded-nrql']}>
        <div className={styles.editor}>
          <textarea
            className={`u-unstyledInput ${styles.entry}`}
            value={nrql}
            onChange={({ target: { value } = {} } = {}) => setNrql(value)}
            onScroll={scrollHandler}
            onKeyDown={keyDownHandler}
          />
          <pre ref={displayNodeHandler} className={styles.display}>
            <code dangerouslySetInnerHTML={{ __html: lexer(nrql) }} />
          </pre>
        </div>
      </div>
      <div className={styles.actions}>
        <div>Use &#9166; to {saveButtonText.toLowerCase()}</div>
        <div className={styles['bump-right']}>
          <button className={styles['small-button']} onClick={saveHandler}>
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

NrqlEditor.propTypes = {
  query: PropTypes.string,
  accountId: PropTypes.number,
  onSave: PropTypes.func,
  saveButtonText: PropTypes.string,
};

export default NrqlEditor;
