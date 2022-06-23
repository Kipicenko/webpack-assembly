# My webpack 5 bundler.
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

Clone this repo and npm install or yarn install.

### `yarn install` or `npm install`

## Usage

### Development server
```bash
npm start || npm run start
```
or
```bash
yarn start || yarn run start
```
---
### Production build

```bash
npm run build
```

or

```bash
yarn run build || yarn build
```
---
### Development build

```bash
npm run dev
```

or

```bash
yarn run dev || yarn dev
```

<h2 align="center">Use of svg</h2>

1) <strong>Import Svg from "arrow.svg"</strong> - ( Imported as a React component )
2) <strong>Import Svg from "arrow.svg?nc"</strong> - ( Will not be imported as a React component )
3) <strong>Import Svg from "arrow.svg?url"</strong> - ( url-loader replacement and also won't be a React component )