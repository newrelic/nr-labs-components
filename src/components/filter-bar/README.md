# FilterBar

The FilterBar component allows a user to filter from a list of options. Based on the choices of the user, the component returns a NRQL query `WHERE` clause.

## Usage

To use the FilterBar component in your project, follow these steps:

Import the component:

```jsx
import { FilterBar } from '@newrelic/nr-labs-components';
```

Use the component in your code:

```jsx
<FilterBar
  options={optionsArray}
  onChange={(whereClause) => fnToHandleChange()}
  getValues={fnToGetAdditionalValues}
/>
```

### Props

The FilterBar component accepts the following props:

- `options` (array) - an array of option objects. See below for object properties.
- `onChange` (function) - a callback function that receives a string formatted as WHERE clauses for a NRQL query.
- `getValues` (function) - an aysnc function that fetches values that match user input.

#### `options` object

- `option` (string) - the title for the option
- `type` (string) - option type - either `string` or `numeric`
- `values` (array) - array of values for the option

#### `getValues`

The async function passed to `getvalues` is called in two scenarios.

- When an empty array is passed for `values` for an option, and the user clicks on the option to expand the list of values for that option. The function is called with just one attribute - `option` and expects an array of values to be returned.
- When the user types out a value in the search field for the option. The attributes passed are the `option` and a `searchString` formatted as a NRQL WHERE clause. 

## Example

Here's an example of how to use the FilterBar component:

```jsx
import React from 'react';
import { FilterBar } from '@newrelic/nr-labs-components';

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

const getValues = async (option, searchString) => {
  console.log(`getValues was called for option ${option}`);
  if (searchString) console.log(`SELECT attribute FROM event ${searchString}`);
  // query for values and return values as an array
  return [];
};

function App() {
  const changeHandler = (whereClause) => {
    console.log(`SELECT * FROM Transaction WHERE ${whereClause}`);
  };

  return (
    <div>
      <h1>FilterBar</h1>
      <FilterBar
        options={options}
        onChange={changeHandler}
        getValues={getValues}
      />
    </div>
  );
}

export default App;
```
