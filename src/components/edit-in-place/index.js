import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

// default placeholder text
const PLACEHOLDER_TEXT = 'Untitled';

// disallowed key codes for ctrl/cmd + b, i, u
const DISALLOWED_KEY_CODES = [
  66, // B
  98, // b
  73, // I
  105, // i
  85, // U
  117, // u
];

const EditInPlace = forwardRef(
  ({ value, setValue, placeholder, disabled = false }, ref) => {
    const editableRef = useRef();
    const caretPosition = useRef();
    const [text, setText] = useState('');

    // expose focus method
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          editableRef.current.focus();
          setTimeout(() => {
            const el = editableRef.current;
            setCaretPosition(el, el.childNodes?.[0]?.textContent?.length);
          }, 0);
        },
      }),
      []
    );

    // set text from value prop
    useEffect(() => sanitizeAndSetText(value), [value]);

    // set caret position after text change
    useEffect(
      () => setCaretPosition(editableRef.current, caretPosition.current),
      [text]
    );

    // strip whitespace from text and save to state
    const sanitizeAndSetText = useCallback((t) =>
      setText(t.replace(/\s/g, ' '))
    );

    // save value on blur
    const blurHandler = useCallback(() => {
      if (setValue) setValue(text);
    }, [text, setValue]);

    // update text on input
    const inputHandler = useCallback((evt) => {
      const { target: { textContent } = {} } = evt;
      caretPosition.current = getCaretPosition(editableRef.current);
      sanitizeAndSetText(textContent);
    });

    const keyDownHandler = useCallback((evt) => {
      const { ctrlKey, metaKey, keyCode } = evt;
      // save on enter
      if (keyCode === 13) {
        evt.preventDefault();
        editableRef.current.blur();
      }
      // prevent ctrl/cmd + b, i, u
      if (
        (ctrlKey || metaKey) &&
        DISALLOWED_KEY_CODES.some((code) => code === keyCode)
      )
        evt.preventDefault();
    });

    // paste handler to only allow text from clipboard
    const pasteHandler = useCallback((evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      // get text only from clipboard
      const textFromClipboard = (
        evt.clipboardData || window.clipboardData
      ).getData('text');
      const selection = window.getSelection();
      if (!textFromClipboard || !selection.rangeCount) return;
      selection.deleteFromDocument();
      selection
        .getRangeAt(0)
        .insertNode(document.createTextNode(textFromClipboard));
      selection.collapseToEnd();

      editableRef.current.normalize();
      caretPosition.current = getCaretPosition(editableRef.current);
      sanitizeAndSetText(editableRef.current.childNodes?.[0]?.textContent);
    });

    // get caret position
    const getCaretPosition = useCallback((elem) => {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return 0;

      const range = selection.getRangeAt(0);
      const clone = range.cloneRange();
      if (!clone) return 0;

      clone.selectNodeContents(elem);
      clone.setEnd(range.endContainer, range.endOffset);
      return clone.toString()?.length || 0;
    });

    // set caret position
    const setCaretPosition = useCallback((elem, offset = 0) => {
      if (!elem?.childNodes?.length) return;
      let selection = window.getSelection();
      let range = document.createRange();
      range.setStart(elem.childNodes[0], offset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    });

    return (
      <div
        suppressContentEditableWarning={true}
        className={styles.editable}
        ref={editableRef}
        contentEditable={!disabled}
        onInput={inputHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
        onPaste={pasteHandler}
        data-placeholder={text ? '' : placeholder || PLACEHOLDER_TEXT}
      >
        {text}
      </div>
    );
  }
);

EditInPlace.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

EditInPlace.displayName = 'EditInPlace';

export default EditInPlace;
