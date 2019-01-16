# babel-plugin-relativify-imports

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![Build Status](https://travis-ci.com/pdesjardins90/babel-plugin-relativify-imports.svg?branch=master)](https://travis-ci.com/pdesjardins90/babel-plugin-relativify-imports)

Babel plugin to convert absolute import paths to relative paths.

Example, given this code in `/src/folder/module.js`:

```javascript
import { OtherModule } from '/src/other-folder/other-module.js'
import '/src/folder/subfolder/submodule1.js'

async function getSubmodule2Lazily() {
  const { submodule2 } = await import('/src/folder/subfolder/submodule2.js')
  submodule2.method()
}

export * from '/src/folder/subfolder/submodule3.js'
```

Will become:

```javascript
import { OtherModule } from '../other-folder/other-module.js'
import './subfolder/submodule1.js'

async function getSubmodule2Lazily() {
  const { submodule2 } = await import('./subfolder/submodule2.js')
  submodule2.method()
}

export * from './subfolder/submodule3.js'
```

Note: to convert bare module imports (`import { Module } from '@organization/module'`), please use [cfware/babel-plugin-bare-import-rewrite](https://github.com/cfware/babel-plugin-bare-import-rewrite) before this plugin in your babel plugin chain.

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
