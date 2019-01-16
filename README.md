# babel-plugin-relativify-imports

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![Build Status](https://travis-ci.com/pdesjardins90/babel-plugin-relativify-imports.svg?branch=master)](https://travis-ci.com/pdesjardins90/babel-plugin-relativify-imports)

Babel plugin to convert absolute import paths to relative paths.

Note: to convert bare module imports, please use [cfware/babel-plugin-bare-import-rewrite](https://github.com/cfware/babel-plugin-bare-import-rewrite) before this plugin in your babel plugin chain.

## Usage

Add to your project:

```bash
npm install babel-plugin-relativify-imports
```

Add `relativify-imports` to `plugins` in your babel settings:

```json
{
  "plugins": ["relativify-imports"]
}
```

## Contributing

### Install

```bash
npm install
```

### Test

```bash
npm test
```
