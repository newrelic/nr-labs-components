# Status Icon

A simple component that displays a status icon based on the `status` prop that is passed to it. Possible values for `status` are included in the `STATUSES` enum.

## Usage

To use the component, simply import it into your project: and pass the `status` prop to the component.

```jsx
import React from 'react';
import { StatusIcon } from '@newrelic/nr-labs-components';

function MyComponent() {
  return (
    <div>
      <StatusIcon status={StatusIcon.STATUSES.SUCCESS} />
    </div>
  );
}
```
### Props

- status (enum): One of possible statuses included in the `STATUSES` enum

### Statuses

Possible statuses in the `STATUSES` enum are:

- `StatusIcon.STATUSES.SUCCESS`
- `StatusIcon.STATUSES.WARNING`
- `StatusIcon.STATUSES.CRITICAL`
- `StatusIcon.STATUSES.UNKNOWN`
