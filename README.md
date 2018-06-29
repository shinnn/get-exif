# get-exif

[![npm version](https://img.shields.io/npm/v/get-exif.svg)](https://www.npmjs.com/package/get-exif)
[![Build Status](https://travis-ci.com/shinnn/get-exif.svg?branch=master)](https://travis-ci.com/shinnn/get-exif)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/get-exif.svg)](https://coveralls.io/github/shinnn/get-exif)

A [Node.js](https://nodejs.org/) module to get Exif data from a `Buffer` of JPEG or TIFF

```javascript
const {readFile} = require('fs').promises;
const getExif = require('exif');

(async () => {
  const exif = getExif(await readFile('example.jpg')).Exif;

  // 33434: tag ID of `ExposureTime` tag
  exif['33434']; //=> [1, 100]

  // 36867: tag ID of `DateTimeOriginal` tag
  exif['36867']; //=> '2017:11:19 08:47:19'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install get-exif
```

## API

```javascript
const getExif = require('get-exif');
```

### getExif(*buffer*)

*buffer*: `Buffer` (data of a [JPEG](https://jpeg.org/jpeg/) file or a [TIFF](https://web.archive.org/web/20160306201233/http://partners.adobe.com/public/developer/tiff/index.html) file)  
Return: `Object`

It reads Exif data from a `Buffer` using [Piexifjs](https://github.com/hMatoba/piexifjs) and return it as an `Object`.

```javascript
getExif(imageBuffer); /*=> {
  '0th': { ... },
  '1st': { ... },
  Exif: { ... },
  GPS: { ... }
  Interop: { ... },
  thumbnail: ' ... '
} */
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
