# Status Icon

A layout component to display multiple [`StatusIcon`](../status-icon)s.

## Usage

To use the component, simply import it into your project and pass an array of statuses.

```jsx
import React from 'react';
import { StatusIcon, StatusIconsLayout } from '@newrelic/nr-labs-components';

const randomStatus = () => {
  const statuses = Object.keys(StatusIcon.STATUSES);
  return statuses[Math.floor(Math.random() * statuses.length - 1)];
};

function MyComponent() {
  return (
    <div style={{ width: 72 }}>
      <StatusIconsLayout
        statuses={[...Array(20).keys()].map(() => ({
          status: StatusIcon.STATUSES[randomStatus()],
        }))}
      />;
    </div>
  );
}
```
### Props

- statuses (array): An array of objects, each object containing props for the individual [`StatusIcon`](../status-icon)

