# Edit In Place

The `EditInPlace` component returns a div that allows users to modify its text directly within the browser.

## Usage

Import the component:

```javascript
import { EditInPlace } from '@newrelic/nr-labs-components';
```

Use the component in your code:

```jsx
<EditInPlace
  value="Initial Text"
  setValue={saveHandler}
/>
```

### Props

- `value` (string) - the initial text to be displayed and edited
- `setValue` (function) - a callback function that will be called with the new edited text when the user saves their changes
- `placeholder` (string) - the text to display when the component is empty
- `disabled` (boolean) - set to true to disable editing

### Methods

You can set a `ref` on the component to access available methods. Currently, the only available method is:

- `focus()` - sets the focus on the component

### Style

The component inherits the styles of the container it's placed in.

## Example

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { EditInPlace } from '@newrelic/nr-labs-components';

function MyComponent() {
  const [value, setValue] = useState('Hello, World!');
  const ref = useRef();

  useEffect(() => console.log('value:', value), [value]);

  return (
    <div>
      <h1>Edit In Place</h1>
      <div style={{
        fontSize: '36px',
        lineHeight: 1.2,
        color: '#1c7baa',
        padding: '8px'
      }}>
        <EditInPlace
          value={value}
          setValue={setValue}
          ref={ref}
          placeholder="Click to edit"
        />
      </div>
      <button onClick={() => ref.current.focus()}>
        Set focus
      </button>
    </div>
  );
}
```
