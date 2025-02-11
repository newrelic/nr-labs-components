# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- NrqlEditor - change account picker to use select element

## [1.23.6] - 2025-02-10

### Fixed

- NrqlEditor - `enter` key would not trigger `onSave`

### Added

- NrqlEditor - `placeholder` prop for placeholder text

## [1.23.5] - 2024-10-29

### Fixed

- EditInPlace - prevents save when in composition session

## [1.23.4] - 2024-09-20

### Fixed

- HelpModal - fixes an issue on missing `ownerBadge` config

## [1.23.3] - 2024-09-12

### Changed

- NrqlEditor - replace existing editor with react-simple-code-editor 

## [1.23.2] - 2024-09-05

### Fixed

- TimeRangePicker - custom date/times get set to blank on closing custom section
- TimePicker - changing start time does not update list of times in dropdown 

## [1.23.1] - 2024-07-31

### Fixed

- TimeRangePicker - unable to select custom end dates other than today
- TimeRangePicker - changing time value resets the date 

## [1.23.0] - 2024-07-02

### Added

- TimeRangePicker - prop to hide `Default` 
- TimeRangePicker - `maxRangeMins` prop to set set a max range in selected date/times

## [1.22.0] - 2024-03-12

### Changed

- FilterBar - minor refactor

### Added

- FilterBar - ability to return `LIKE` statements

## [1.21.2] - 2023-12-29

### Changed

- TimeRangePicker - return timestamp for `begin_time` and `end_time`

## [1.21.1] - 2023-12-18

### Changed

- DatePicker - disallow bubbling of onclick event, which was causing parent popover to close

## [1.21.0] - 2023-12-18

### Added

- TimeRangePicker component by [@amit-y](https://github.com/amit-y)

## [1.20.0] - 2023-12-18

### Added

- DateTimePicker component by [@amit-y](https://github.com/amit-y)

## [1.19.0] - 2023-12-18

### Added

- TimePicker component by [@amit-y](https://github.com/amit-y)

## [1.18.0] - 2023-12-18

### Changed

- SimpleBillboard - add option to enable title's tooltip + change up/down trend arrow colors to grey by [@shahramk](https://github.com/shahramk)

## [1.17.0] - 2023-12-14

### Added

- DatePicker component by [@amit-y](https://github.com/amit-y)

## [1.16.0] - 2023-08-09

### Added

- FilterBar component by [@amit-y](https://github.com/amit-y)

## [1.15.0] - 2023-05-18

### Added

- Progress Bar component by [@aso1124](https://github.com/aso1124)

## [1.14.2] - 2023-05-02

### Changed

- Update SimpleBillboard component styles

## [1.14.1] - 2023-04-27

### Changed

- SimpleBillboard component
  - [trend icons](https://github.com/newrelic/nr-labs-components/commit/fc4bd01e441c4380368ab8f67c9c74c6452ed0f6)
  - [styles](https://github.com/newrelic/nr-labs-components/commit/369df4259b87dd101f88796f1d82f1b6cdb0ce18)
  - [update readme](https://github.com/newrelic/nr-labs-components/commit/4f37b9c5eec82f8a8d5179657896dbaa7993b316)

## [1.14.0] - 2023-04-25

### Added

- StatusIconsLayout component by [@amit-y](https://github.com/amit-y)

## [1.13.0] - 2023-04-25

### Added

- Props `style`, `title`, `onClick` to StatusIcon

## [1.12.0] - 2023-04-24

### Added

- `BLANK` option to `STATUSES` enum in StatusIcon
- StatusIcon now accepts optional `color` prop

## [1.11.0] - 2023-04-21

### Added

- StatusIcon component by [@amit-y](https://github.com/amit-y)

## [1.10.2] - 2023-04-20

### Fixed

- Gets correct window object when using EditInPlace in an iframe

## [1.10.1] - 2023-04-17

### Changed

- Styling changes for SimpleBillboard

## [1.10.0] - 2023-04-14

### Added

- NrqlEditor component by [@amit-y](https://github.com/amit-y)

## [1.9.0] - 2023-04-14

### Added

- Extract all CSS to a file

## [1.8.0] - 2023-04-13

### Added

- SimpleBillboard component by [@shahramk](https://github.com/shahramk)

## [1.7.0] - 2023-03-31

### Added

- timeRangeToNrql by [@aso1124](https://github.com/aso1124)

## [1.6.5] - 2023-03-31

### Added

- `example.json` file for the `Messages` component

## [1.6.4] - 2023-03-30

### Fixed

- Removes non-breaking spaces and trims the text returned by `setValue` in `EditInPlace`

## [1.6.3] - 2023-03-30

### Fixed

- [#43](https://github.com/newrelic/nr-labs-components/issues/43)

## [1.6.2] - 2023-03-30

### Changed

- Switch the JSX transform to classic

## [1.6.1] - 2023-03-30

### Changed

- Added react-dom to the peer dependency list

## [1.6.0] - 2023-03-30

### Added

- EditInPlace component by [@amit-y](https://github.com/amit-y).

## [1.5.0] - 2023-03-20

### Added

- About section added to HelpModal by [@aso1124](https://github.com/aso1124)

## [1.4.0] - 2023-02-24

### Added

- Messages component by [@aso1124](https://github.com/aso1124)

## [1.3.0] - 2022-11-22

### Added

- HelpModal component by [@aso1124](https://github.com/aso1124)

## [1.2.0] - 2022-11-22

### Changed

- Using css modules to inject styles for MultiSelect

## [1.1.2] - 2022-11-22

### Added

- Added a Github action to publish package on new release

### Changed

- Updated peerDependencies versions

## [1.1.1] - 2022-11-22

### Changed

- Moved dependencies to peerDependencies

## [1.1.0] - 2022-11-22

### Added

- Added rollup for bundling

## [1.0.0] - 2022-10-20

### Added

- MultiSelect component by [@amit-y](https://github.com/amit-y).
