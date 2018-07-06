'use strict';

const inspect = require('util').inspect;

const load = require('piexifjs').load;
const isJpg = require('is-jpg');
const SafeBuffer = require('safe-buffer').Buffer;

const ERROR = 'Expected a Buffer of JPEG or a Buffer-to-latin1 encoded string of it';
const SIZE_ERROR = 'JPEG must be 107 bytes or more.';

module.exports = function getExif(arg) {
	let buf = arg;

	if (typeof arg === 'string') {
		if (arg.length === 0) {
			throw new RangeError(`${ERROR}, but got '' (empty string). ${SIZE_ERROR}`);
		}

		buf = SafeBuffer.from(buf, 'binary');
	} else {
		arg = arg.toString('binary');
	}

	if (!Buffer.isBuffer(buf)) {
		throw new TypeError(`${ERROR}, but got ${inspect(buf)}.`);
	}

	if (buf.length === 0) {
		throw new RangeError(`${ERROR}, but got an empty Buffer. ${SIZE_ERROR}`);
	}

	if (buf.length < 107) {
		throw new RangeError(`${ERROR}, but got insufficient data size ${buf.length}. ${SIZE_ERROR}`);
	}

	if (!isJpg(buf)) {
		throw new RangeError(`${ERROR}, but got a Buffer of neither.`);
	}

	return load(arg);
};
