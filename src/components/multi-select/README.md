# MultiSelect

The MultiSelect component allows users to select multiple options from a dropdown menu. 

## Usage

Import the component:

```javascript
import { MultiSelect } from '@newrelic/nr-labs-components';
```

Use the component in your code:

```jsx
<MultiSelect
  items={itemsArray}
  onChange={(updatedItemsArray) => fnToHandleUpdate()}
/>
```

### Props

The MultiSelect component accepts the following props:

- `items` (array) - an array of items for the dropdown. See below for a list of properties for the item object.
- `onChange` (function) - callback function that is called when an item is selected or unselected from the dropdown. The function receives an updated version of the items.

#### `items` object

- `item` (string) - item to display in the dropdown
- `isSelected` (boolean) - boolean value to indicate if item is selected in the dropdown  

## Example

Here's an example of how to use the MultiSelect component:

```jsx
import React, { useState } from 'react';
import { MultiSelect } from '@newrelic/nr-labs-components';

function App() {
  const [items, setItems] = useState([
    { item: 'Option 1', isSelected: false },
    { item: 'Option 2', isSelected: false },
    { item: 'Option 3', isSelected: false },
    // ... more options
  ]);

  return (
    <div>
      <h1>MultiSelect</h1>
      <MultiSelect
        items={items}
        onChange={setItems}
      />
    </div>
  );
}

export default App;
```
