import React from 'react';
import { shallow } from 'enzyme';

import Label from './label';

describe('Label component', () => {
  const label = 'Foo';

  it('displays a span', () => {
    const wrapper = shallow(<Label value={label} />);
    expect(wrapper.type()).toBe('span');
  });

  it('contains a span with the passed value', () => {
    const wrapper = shallow(<Label value={label} />);
    const span = wrapper.childAt(0);
    expect(span.type()).toBe('span');
    expect(span.childAt(0).text()).toBe(label);
  });

  it('displays a remove icon', () => {
    const wrapper = shallow(<Label value={label} />);
    const removeIcon = wrapper.childAt(1);
    expect(removeIcon.type()).toBe('span');
    expect(removeIcon.childAt(0).type()).toBe('img');
  });

  it('calls onRemove when remove icon is clicked', () => {
    const onRemove = jest.fn();
    const wrapper = shallow(<Label value="Foo" onRemove={onRemove} />);
    const removeIcon = wrapper.childAt(1);
    removeIcon.simulate('click', { stopPropagation: () => {} });
    expect(onRemove).toHaveBeenCalled();
  });
});
