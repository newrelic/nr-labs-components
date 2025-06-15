[![Community Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/Community_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#community-project)

# nr-labs-components

![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr-labs-components?include_prereleases&sort=semver) [![Snyk](https://snyk.io/test/github/newrelic/nr-labs-components/badge.svg)](https://snyk.io/test/github/newrelic/nr-labs-components)

A library of React components and helpful utilities created by New Relic's Labs-Viz team, primarily for use in [apps built for the New Relic One platform](https://developer.newrelic.com/build-apps/).

## Installation

```bash
npm install --save @newrelic/nr-labs-components
```

## Usage

Import `styles.css` in your stylesheet.

```css
@import '~@newrelic/nr-labs-components/dist/styles.css';
```

Import components/utilities in you javascript.

```javascript
import { COMPONENT_OR_UTILITY, COMPONENT_OR_UTILITY, ... } from '@newrelic/nr-labs-components';
```

## Components

### [MultiSelect](src/components/multi-select)
Allows users to select multiple options from a dropdown menu.

### [HelpModal](src/components/help-modal)
A modal component that allows for simple inclusion of support and documentation links within a New Relic app.

### [Messages](src/components/messages)
A component to support push notifications into a New Relic app.

### [EditInPlace](src/components/edit-in-place)
Enable editing of the text content of HTML tags in the browser.

### [SimpleBillboard](src/components/simple-billboard)
A component that renders a metric's name and value, and its up/down trend against a different time range.

### [NrqlEditor](src/components/nrql-editor)
A NRQL editor in the browser.

### [StatusIcon](src/components/status-icon)
Displays a status icon.

### [StatusIconsLayout](src/components/status-icons-layout)
A layout component for `StatusIcon`

### [ProgressBar](src/components/progress-bar)
A component that renders a progress bar.

### [FilterBar](src/components/filter-bar)
Component that allows a user to filter options.

### [DatePicker](src/components/date-picker)
Component that displays a calendar to select a date

### [TimePicker](src/components/time-picker)
Component to select time values

### [DateTimePicker](src/components/date-time-picker)
Component to select date/time

### [TimeRangePicker](src/components/time-range-picker)
Component to select time range

## Utilities

### [timeRangeToNrql](src/utils/time-range-to-nrql/)
A utility to convert the New Relic platform time range into a NRQL compliant clause.

## Open Source License

This project is distributed under the [Apache 2 license](LICENSE).

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

### Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices.

### Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](./issues). Please search for and review the existing open issues before submitting a new issue.

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contribution Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource+nr-labs-components@newrelic.com.
