import React from 'react';
import { render, screen } from '@testing-library/react';

import EditInPlace from './';

describe('EditInPlace component', () => {
  it('displays a contenteditable div with the default placeholder', () => {
    const { container } = render(<EditInPlace />);
    const editable = container.querySelector('[contenteditable]');
    expect(editable.tagName).toBe('DIV');
    expect(editable.getAttribute('contenteditable')).toBe('true');
    expect(editable.getAttribute('data-placeholder')).toBe('Untitled');
  });

  it('displays the passed value', () => {
    const value = 'Hello, World!';
    render(<EditInPlace value={value} />);
    expect(screen.getByText(value)).toBeInTheDocument();
  });
});
