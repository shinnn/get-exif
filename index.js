'use strict';

var inspect = require('util').inspect;

var load = require('piexifjs').load;
var isJpg = require('is-jpg');
var isTif = require('is-tif');
var SafeBuffer = require('safe-buffer').Buffer;

var ERROR = 'Expected a Buffer of JPEG/TIFF, or a Buffer-to-latin1 encoded string of it';
var SIZE_ERROR = 'JPEG must be 107 bytes or more, and TIFF must be 46 bytes or more.';

module.exports = function getExif(arg) {
	var buf = arg;

	if (typeof arg === 'string') {
		if (arg.length === 0) {
			throw new RangeError(ERROR + ', but got \'\' (empty string). ' + SIZE_ERROR);
		}

		buf = SafeBuffer.from(buf, 'binary');
	} else {
		arg = arg.toString('binary');
	}

	if (!Buffer.isBuffer(buf)) {
		throw new TypeError(ERROR + ', but got ' + inspect(buf) + '.');
	}

	if (buf.length === 0) {
		throw new RangeError(ERROR + ', but got an empty Buffer. ' + SIZE_ERROR);
	}

	if (buf.length < 46) {
		throw new RangeError(ERROR + ', but got insufficient data size ' + buf.length + '. ' + SIZE_ERROR);
	}

	if (!isJpg(buf) && !isTif(buf)) {
		throw new RangeError(ERROR + ', but got a Buffer of neither.');
	}

	return load(arg);
};
