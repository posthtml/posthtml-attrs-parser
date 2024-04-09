# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.0] - 2024-04-09

### New Features

- the plugin now exports both ESM and CJS, you may use it in CJS too

## [1.0.1] - 2024-01-23

### Fixed

- ensure no-value attribute is a string d0f8b2c

## [1.0.0] - 2024-01-21

### New Features

- stop quoting empty/no-value attributes

### Changed

- **[BREAKING]** require Node.js 16+
- **[BREAKING]** plugin is now ESM-only
- updated dependencies
- migrated tests to Vitest

### Added

- added GitHub Actions build workflow
- added dependabot for automated dependency updates

## [0.1.1] - 2016-01-05

### Fixed

- [`style` parsing error](https://github.com/posthtml/posthtml-attrs-parser/issues/1)

[0.1.1]: https://github.com/posthtml/posthtml-attrs-parser/compare/0.1.0...0.1.1
[1.0.0]: https://github.com/posthtml/posthtml-attrs-parser/compare/0.1.1...1.0.0
