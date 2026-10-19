import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MultiSelect from './index';

describe('MultiSelect component', () => {
  let items;

  beforeEach(() => {
    items = [
      { item: 'Foo', isSelected: false },
      { item: 'Bar', isSelected: false },
      { item: 'Baz', isSelected: false },
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('displays a div', () => {
    const { container } = render(<MultiSelect items={items} />);
    expect(container.firstChild.tagName).toBe('DIV');
  });

  it('displays an input field with placeholder', () => {
    render(<MultiSelect items={items} />);
    expect(screen.getByText('Group by...')).toBeInTheDocument();
  });

  it('opens and closes the items list when input field is clicked', () => {
    render(<MultiSelect items={items} />);
    const field = screen.getByText('Group by...');

    fireEvent.click(field);
    expect(screen.getAllByRole('checkbox')).toHaveLength(items.length);

    fireEvent.click(field);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('should output error message when checking an item and onChange is not passed', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<MultiSelect items={items} />);
    fireEvent.click(screen.getByText('Group by...'));

    fireEvent.click(screen.getByLabelText(items[0].item));

    expect(console.error).toHaveBeenCalled();
  });

  it('should select an item when checking an item and onChange is passed', () => {
    const onChange = jest.fn();
    render(<MultiSelect items={items} onChange={onChange} />);
    fireEvent.click(screen.getByText('Group by...'));

    fireEvent.click(screen.getByLabelText(items[0].item));

    expect(items[0].isSelected).toBe(true);
    expect(screen.getByRole('checkbox', { name: items[0].item })).toBeChecked();
    expect(screen.getAllByText(items[0].item)).toHaveLength(2);
  });
});
