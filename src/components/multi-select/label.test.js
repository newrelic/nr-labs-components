import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Label from './label';

describe('Label component', () => {
  const label = 'Foo';

  it('displays a span', () => {
    const { container } = render(<Label value={label} />);
    expect(container.firstChild.tagName).toBe('SPAN');
  });

  it('contains a span with the passed value', () => {
    render(<Label value={label} />);
    expect(screen.getByText(label).tagName).toBe('SPAN');
  });

  it('displays a remove icon', () => {
    render(<Label value={label} />);
    expect(screen.getByAltText('remove').tagName).toBe('IMG');
  });

  it('calls onRemove when remove icon is clicked', () => {
    const onRemove = jest.fn();
    render(<Label value="Foo" onRemove={onRemove} />);
    fireEvent.click(screen.getByAltText('remove'));
    expect(onRemove).toHaveBeenCalled();
  });
});
