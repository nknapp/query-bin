# Changelog

# Upcoming

# v0.6.0

Date: 2024-05-30T13:40:22.393Z

- Expose `Queries` type

# v0.5.0

Date: 2024-05-30T13:15:37.382Z

- Breaking: New Method for defining queries
  - queryAll function is replaced by a "test" function
    which takes a single item and returns a boolean

# v0.4.0

Date: 2024-04-21T22:14:24.556Z

- Breaking: Remove unused option "retryDelayMillis"
- Feature: Make "serializeForErrorMessage" optional. Default is `JSON.stringify` with 2 indent.

# v0.3.0

Date: 2024-04-21T22:11:04.415Z

- Performance: Better handling of wait timeouts. Instead of waiting in intervals of 50ms, we check the result whenever new results are
  added to the bin.
- Feature: "clear" method to remove all objects

# v0.2.1

Date: 2024-04-21T21:47:25.224Z

- Remove unnecessary dependencies

# v0.2.0

Date: 2024-04-21T21:43:36.901Z

- Build common-js version

# v0.1.3

Date: 2024-04-21T21:17:22.123Z

- Update docs

# v0.1.2

Date: 2024-04-21T20:43:26.130Z

# Chores

- Fix setup by moving git hook initialization to "prepare" script

# v0.1.1

Date: 2024-04-21T18:25:52.094Z

## Chores

- Add version automation again

# v0.1.0

Date: 2024-04-21T18:23:06.036Z

## Features

- options to tweak timeouts for "find" and "findAll"
- simpler error message definition

# v0.0.3

Date: 2024-04-21T16:26:50.399Z

- Fix logo in README

# v0.0.1 - v0.0.3

First version, first publish
