import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { AccountPicker } from 'nr1';
import Editor from 'react-simple-code-editor';

import patterns from './patterns';

import styles from './index.scss';

const NRQL_STYLES = {
  keyword: 'color: #AA1BC8;',
  function: 'color: #3B79B8;',
  string: 'color: #4F8400;',
  numeric: 'color: #AB6400;',
  operator: 'color: #3D808A;',
};

const lexer = (nrql) =>
  patterns.reduce(
    (acc, { name, regex } = {}) =>
      acc.replace(
        regex,
        (match) => `<span style="${NRQL_STYLES[name]}">${match}</span>`
      ),
    nrql
  );

const NrqlEditor = ({
  query = '',
  accountId,
  onSave,
  placeholder,
  saveButtonText = 'Run',
}) => {
  const [nrql, setNrql] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState();

  useEffect(() => setSelectedAccountId(accountId), [accountId]);

  useEffect(() => setNrql(query), [query]);

  const saveHandler = useCallback(() => {
    if (onSave) onSave({ query: nrql, accountId: selectedAccountId });
  }, [nrql, selectedAccountId, onSave]);

  const keyDownHandler = useCallback(
    (e) => {
      if (e?.keyCode === 13) {
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
        <div>
          <Editor
            value={nrql}
            onValueChange={(code) => setNrql(code)}
            onKeyDown={keyDownHandler}
            highlight={(code) => lexer(code)}
            placeholder={placeholder}
            textareaClassName="u-unstyledInput"
            padding={8}
            style={{
              fontFamily: 'monospace',
              fontSize: 16,
              color: '#E9ECEC',
              lineHeight: '19px',
            }}
          />
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
  placeholder: PropTypes.string,
  saveButtonText: PropTypes.string,
};

export default NrqlEditor;
