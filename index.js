'use strict';

const {load} = require('piexifjs');
const inspectWithKind = require('inspect-with-kind');
const isJpg = require('is-jpg');

const ERROR = 'Expected a Buffer of JPEG or a Buffer-to-latin1 encoded string of it';
const SIZE_ERROR = 'JPEG must be 107 bytes or more.';

module.exports = function getExif(...args) {
	const argLen = args.length;

	if (argLen !== 1) {
		throw new RangeError(`Expected 1 argument (<Buffer|string>), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [arg] = args;
	let buf;

	if (Buffer.isBuffer(arg)) {
		buf = arg;

		if (buf.length === 0) {
			throw new RangeError(`${ERROR}, but got an empty Buffer. ${SIZE_ERROR}`);
		}
	} else if (typeof arg === 'string') {
		buf = Buffer.from(arg, 'binary');

		if (buf.length === 0) {
			throw new RangeError(`${ERROR}, but got '' (empty string). ${SIZE_ERROR}`);
		}
	} else {
		throw new TypeError(`${ERROR}, but got ${inspectWithKind(arg)}.`);
	}

	if (buf.length < 107) {
		throw new RangeError(`${ERROR}, but got insufficient data size ${Buffer.byteLength(arg, 'binary')}. ${SIZE_ERROR}`);
	}

	if (!isJpg(buf)) {
		throw new RangeError(`${ERROR}, but got non-JPEG data.`);
	}

	return load(arg.toString('binary'));
};
