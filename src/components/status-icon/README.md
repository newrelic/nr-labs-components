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
- title (string): Text to display as a tooltip
- style (object): An object containing custom styles to apply to the component
- color (string): A CSS color string (see example below)

```jsx
<StatusIcon color="#FF00999" />
```

- onClick (function): A function that is called when the user clicks the icon

### Statuses

Possible statuses in the `STATUSES` enum are:

- `StatusIcon.STATUSES.SUCCESS`
- `StatusIcon.STATUSES.WARNING`
- `StatusIcon.STATUSES.CRITICAL`
- `StatusIcon.STATUSES.UNKNOWN`
- `StatusIcon.STATUSES.BLANK`
