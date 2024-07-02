# TimeRangePicker

The `TimeRangePicker` component is used to select a time period.

## Usage

To use the component, simply import and use:

```jsx
import React, { useState } from 'react';
import { TimeRangePicker } from '@newrelic/nr-labs-components';

function MyComponent() {
  const [timeRange, setTimeRange] = useState(new Date());

  return (
    <div>
      <TimeRangePicker timeRange={timeRange} onChange={setTimeRange} />
    </div>
  );
}
```
### Props

- date (date): The default time period 
- maxRangeMins (int): The max time range allowed, in minutes
- hideDefault (boolean): If true, hides the `Default` selection
- onChange (function): A function that is called when the user selects a time range. The function is passed an abject in the following format:

```javascript
{
  "begin_time": null, // start date/time, if custom time, or null if not
  "duration": 1800000, // duration in milliseconds
  "end_time": null // end date/time, if custom time, or null if not
}
```

