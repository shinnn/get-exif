'use strict';

var inspect = require('util').inspect;

var load = require('piexifjs').load;
var isJpg = require('is-jpg');
var isTif = require('is-tif');

var ERROR = 'Expected a buffer of JPEG of TIFF';
var SIZE_ERROR = 'JPEG must be 107 bytes or more, and TIFF must be 46 bytes or more.';

module.exports = function getExif(buf) {
	if (!Buffer.isBuffer(buf)) {
		throw new TypeError(ERROR + ', but got a non-Buffer value ' + inspect(buf) + '.');
	}

	if (buf.length === 0) {
		throw new RangeError(ERROR + ', but got an empty buffer. ' + SIZE_ERROR);
	}

	if (buf.length < 46) {
		throw new RangeError(ERROR + ', but got a buffer with insufficient data size ' + buf.length + '. ' + SIZE_ERROR);
	}

	if (!isJpg(buf) && !isTif(buf)) {
		throw new RangeError(ERROR + ', but got a buffer of neither.');
	}

	return load(buf.toString('binary'));
};
