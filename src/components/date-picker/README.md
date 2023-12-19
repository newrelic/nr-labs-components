# DatePicker

The `DatePicker` component displays a calendar to select a date.

## Usage

To use the component, simply import and use:

```jsx
import React, { useState } from 'react';
import { DatePicker } from '@newrelic/nr-labs-components';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <DatePicker date={selectedDate} onChange={setSelectedDate} />
    </div>
  );
}
```
### Props

- date (date): The default date 
- onChange (function): A function that is called when the user selects a date
- validFrom (date): only allow dates starting from the provided value
