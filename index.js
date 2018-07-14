'use strict';

const {load} = require('piexifjs');
const inspectWithKind = require('inspect-with-kind');
const isJpg = require('is-jpg');

const MINIMUM_JPEG_SIZE = 107;
const ERROR = 'Expected a Buffer of JPEG or a Buffer-to-latin1 encoded string of it';
const SIZE_ERROR = `JPEG must be ${MINIMUM_JPEG_SIZE} bytes or more.`;

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
			const error = new RangeError(`${ERROR}, but got an empty Buffer. ${SIZE_ERROR}`);
			error.code = 'ERR_INSUFFICIENT_DATA_SIZE';
			error.passedSize = 0;
			error.requiredSize = MINIMUM_JPEG_SIZE;

			throw error;
		}
	} else if (typeof arg === 'string') {
		buf = Buffer.from(arg, 'binary');

		if (buf.length === 0) {
			const error = new RangeError(`${ERROR}, but got '' (empty string). ${SIZE_ERROR}`);
			error.code = 'ERR_INSUFFICIENT_DATA_SIZE';
			error.passedSize = 0;
			error.requiredSize = MINIMUM_JPEG_SIZE;

			throw error;
		}
	} else {
		const error = new TypeError(`${ERROR}, but got ${inspectWithKind(arg)}.`);
		error.code = 'ERR_INVALID_ARG_TYPE';

		throw error;
	}

	if (buf.length < MINIMUM_JPEG_SIZE) {
		const error = new RangeError(`${ERROR}, but got insufficient data size ${Buffer.byteLength(arg, 'binary')}. ${SIZE_ERROR}`);
		error.code = 'ERR_INSUFFICIENT_DATA_SIZE';
		error.passedSize = buf.length;
		error.requiredSize = MINIMUM_JPEG_SIZE;

		throw error;
	}

	if (!isJpg(buf)) {
		const error = new RangeError(`${ERROR}, but got non-JPEG data.`);
		error.code = 'ERR_DATA_NOT_SUPPORTED';

		throw error;
	}

	return load(arg.toString('binary'));
};
