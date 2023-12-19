# DateTimePicker

The `DateTimePicker` component is used to select a date/time value.

## Usage

To use the component, simply import and use:

```jsx
import React, { useState } from 'react';
import { DateTimePicker } from '@newrelic/nr-labs-components';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <DateTimePicker date={selectedDate} onChange={setSelectedDate} />
    </div>
  );
}
```
### Props

- date (date): The default date 
- onChange (function): A function that is called when the user selects a date
- validFrom (date): only allow date/times starting from the provided value
- validTill (date): only allow date/times ending till the provided value
