# FilterBar2

An alternate to the [FilterBar](../filter-bar) component, to select filters from a list of options. This version attempts to be similar to how filtering works in the New Relic platform, with minor differences. Returns a query to be used in as a NRQL query `WHERE` clause.

## Usage

To use the FilterBar2 component in your project, follow these steps:

Import the component:

```jsx
import { FilterBar2 } from '@newrelic/nr-labs-components';
```

Use the component in your code:

```jsx
<FilterBar2
  options={optionsArray}
  onChange={(whereClause, filtersArray) => fnToHandleChange(whereClause)}
/>
```

### Props

The FilterBar component accepts the following props:

- `options` (array) - an array of option objects. See below for object properties.
- `onChange` (function) - a callback function that receives a string formatted as WHERE clauses for a NRQL query, and an array of the selected filters.

#### `options` object

- `option` (string) - the title for the option
- `type` (string) - option type - either `string` or `numeric`
- `values` (array) - array of values (string) for the option

## Example

Here's an example of how to use the FilterBar2 component:

```jsx
import React from 'react';
import { FilterBar2 } from '@newrelic/nr-labs-components';

const options = [
  {
    option: 'responseCode',
    type: 'numeric',
    values: ['200', '404'],
  },
  {
    option: 'scheme',
    type: 'string',
    values: ['https', 'http'],
  },
  // ... more filter options
];

function App() {
  const changeHandler = (whereClause) => {
    console.log(`SELECT * FROM Transaction WHERE ${whereClause}`);
  };

  return (
    <div>
      <h1>FilterBar2</h1>
      <FilterBar2
        options={options}
        onChange={changeHandler}
        getValues={getValues}
      />
    </div>
  );
}

export default App;
```
