igc-filename-parser
==============================================================================

[![Build Status](https://travis-ci.org/Turbo87/igc-filename-parser.svg?branch=master)](https://travis-ci.org/Turbo87/igc-filename-parser)

IGC flight log filename parser


Install
------------------------------------------------------------------------------

```bash
npm install --save igc-filename-parser
```

or using [`yarn`](https://yarnpkg.com/):

```bash
yarn add igc-filename-parser
```


Usage
------------------------------------------------------------------------------

```js
const parse = require('igc-filename-parser');

let result = parse('78_65dv1qz1.igc');
```

```js
{
  callsign: '78',
  date: '2016-05-13', 
  manufacturer: 'LXNAV', 
  loggerId: '1QZ', 
  numFlight: 1, 
}
```

License
------------------------------------------------------------------------------

igc-filename-parser is licensed under the [MIT License](LICENSE).
