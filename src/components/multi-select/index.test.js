import React from 'react';
import { shallow } from 'enzyme';

import MultiSelect from './index';
import Label from './label';

describe('MultiSelect component', () => {
  const items = [
    { item: 'Foo', isSelected: false },
    { item: 'Bar', isSelected: false },
    { item: 'Baz', isSelected: false },
  ];
  
  it('displays a div', () => {
    const wrapper = shallow(<MultiSelect items={items} />);
    expect(wrapper.type()).toBe('div');
  });

  it('displays an input field with placeholder', () => {
    const wrapper = shallow(<MultiSelect items={items} />);
    const inputField = wrapper.childAt(0).childAt(1);
    expect(inputField.type()).toBe('div');
    expect(inputField.text()).toBe('Group by...');
  });

  it('opens and closes the items list when input field is clicked', () => {
    const wrapper = shallow(<MultiSelect items={items} />);
    wrapper.childAt(0).childAt(1).simulate('click');
    expect(wrapper.children().length).toBe(2);
    expect(wrapper.childAt(1).children().length).toBe(items.length);
    wrapper.childAt(0).childAt(1).simulate('click');
    expect(wrapper.children().length).toBe(1);
  });

  it('should output error message when checking an item and onChange is not passed', () => {
    const wrapper = shallow(<MultiSelect items={items} />);
    wrapper.childAt(0).childAt(1).simulate('click');
    const checkIndex = 0;
    const check = wrapper.childAt(1).childAt(0).childAt(checkIndex);
    console.error = jest.fn();
    check.simulate('change', {target: {checked: true}});;
    expect(console.error).toHaveBeenCalled();
  });

  it('should select an item when checking an item and onChange is passed', () => {
    const onChange = jest.fn();
    const wrapper = shallow(<MultiSelect items={items} onChange={onChange} />);
    wrapper.childAt(0).childAt(1).simulate('click');
    const checkIndex = 0;
    const check = wrapper.childAt(1).childAt(0).childAt(checkIndex);
    check.simulate('change', {target: {checked: true}});;
    expect(items[checkIndex].isSelected).toBe(true);
    expect(wrapper.childAt(0).childAt(1).childAt(0).matchesElement(<Label />)).toBe(true);
    expect(wrapper.childAt(0).childAt(1).childAt(0).prop('value')).toBe(items[checkIndex].item);
  });
});
