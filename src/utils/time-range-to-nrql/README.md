# timeRangeToNrql

The `timeRangeToNrql` utility converts the [timeRange](https://developer.newrelic.com/components/platform-state-context) provided by the New Relic platform into a NRQL compliant time clause.

For instance, a timeRange structured like this:

```
{
    "timeRange": {
        "begin_time": null,
        "duration": 1800000,
        "end_time": null
    }
}
```
will return a NRQL clause of `SINCE 3 MINUTES AGO`

## example

```jsx
import React, { useContext } from 'react';
import { PlatformStateContext } from 'nr1';
import { timeRangeToNrql } from '@newrelic/nr-labs-components';

const myNerdlet = () => {
  const platformState = useContext(PlatformStateContext)
  return (<pre>timeRangeToNrql(platformState)</pre>)
}
export default myNerdlet
```
