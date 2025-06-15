# FilterBar

The FilterBar component allows a user to filter from a list of options. The component returns an array of objects containing the user's selections.

## Usage

To use the FilterBar component in your project, follow these steps:

Import the component:

```jsx
import { FilterBar } from '@newrelic/nr-labs-components';
```

Use the component in your code:

```jsx
<FilterBar
  options={[]}
  onChange={(arrayWithSelections) => {/* HANDLE SELECTIONS CHANGE */}}
  defaultSelections={[]}
  ref={null}
/>
```

### Props

The FilterBar component accepts the following props:

- `options` (array) - an array of option objects. See below for object properties.
- `onChange` (function) - a callback function that is called when selections change; the function receives an array of selections object (see below)
- `defaultSelection` (array) - an array containing the selections when the component loads up.

Optionally, a ref can be passed to the component which is useful for updating the selections in the component from a parent component.

#### `options` array object

- `option` (string) - the title for the option
- `type` (string) - option type - either `string`, `numeric` or `boolean`
- `values` (array) - array of values object (see details below) for the option

#### `values` array object

- `value` (string) - the displayed value
- `label` (string) - an optional string that is used to display the value; if not present, `value` is used 

### `setSelections` function

The component exposes a `setSelections` function which can be used to update the selections in the component from the parent. The updated array of selections (see below) are passed as an argument to the function

#### `selections` array object

- `id` (string) - an id for the selection; used internally only
- `key` (object) - an object containing the selected attribute for the condition; object contains the following:
  - `value` (string) - the attribute for the condition
  - `type` (string) - attribute type (one of `string`, `numeric`, or `boolean`)
  - `index` (integer) - used internally only
- `operator` (object) - object contains:
  - `value` (string) - the operator
  - `label` (string) - displayed label
- `values` (array | object) - an object with attribute values for the condition (array of objects if multiple values are selected); the object contains a `value` string, and passes through any other information
- `conjunction` (object) - an optional conjunction (`OR`, `AND`) that is only present if there are other conditions that follow; object contains:
  - `value` (string) - the selected conjunction
  - `label` (string) - the display text for the selected conjunction

## Example

Here's an example of how to use the FilterBar component:

```jsx
import React from 'react';
import { FilterBar } from '@newrelic/nr-labs-components';

const options = [{
    option: 'responseCode',
    type: 'numeric',
    values: [{ value: '200' }, { value: '404' }],
  },
  {
    option: 'transaction',
    type: 'string',
    values: [
      {value: 'Transaction 1', id: 'abcde12345'},
      {value: 'Transaction 2', id: 'fghij67890'},
    ]
  },
  {
    option: 'scheme',
    type: 'string',
    values: [{ value: 'https' }, { value: 'http' }],
  },
  // ... more filter options
];

function App() {
  const [filterSelections, setFilterSelections] = useState([]);
  const filterRef = useRef(null);

  useEffect(() => {
    // used to display the selections when changed
    console.log('filter selections', filterSelections);
  }, [filterSelections]);

  return (
    <div>
      <h1>FilterBar</h1>
      <FilterBar
        options={options}
        defaultSelections={filterSelections}
        onChange={setFilerSelections}
        ref={filterRef}
      />
      <button
        onClick={() => {
          filterRef.current?.setSelections([]);
        }}
      >
        Clear filter(s)
      </button>
    </div>
  );
}

export default App;
```
