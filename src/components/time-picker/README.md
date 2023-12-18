# TimePicker

The `TimePicker` component is used to select a time value from a list of valid times.

## Usage

To use the component, simply import and use:

```jsx
import React, { useState } from 'react';
import { TimePicker } from '@newrelic/nr-labs-components';

function MyComponent() {
  const [selectedTime, setSelectedTime] = useState(new Date());

  return (
    <div>
      <TimePicker time={selectedTime} onChange={setSelectedTime} />
    </div>
  );
}
```
### Props

- time (date): The default time 
- onChange (function): A function that is called when the user selects a time
- validFrom (date): only allow times starting from the provided value
- validTill (date): only allow times ending till the provided value
