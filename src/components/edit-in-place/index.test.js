import React from 'react';
import { mount, shallow } from 'enzyme';

import EditInPlace from './';

describe('EditInPlace component', () => {
  it('displays a contenteditable div with the default placeholder', () => {
    const wrapper = shallow(<EditInPlace />);
    expect(wrapper.type()).toBe('div');
    expect(wrapper.prop('contentEditable')).toBe(true);
    expect(wrapper.prop('data-placeholder')).toBe('Untitled');
  });

  it('displays the passed value', () => {
    const value = 'Hello, World!';
    const wrapper = mount(<EditInPlace value={value} />);
    expect(wrapper.text()).toBe(value);
  });
});
