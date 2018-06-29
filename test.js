'use strict';

const {dump, ExifIFD, insert} = require('piexifjs');
const getExif = require('.');
const smallestJpeg = require('smallest-jpeg');
const test = require('tape');

const fixture = Buffer.from(insert(dump({
	Exif: {
		[ExifIFD.Sharpness]: 777
	}
}), smallestJpeg().toString('binary')), 'binary');

test('getExif()', async t => {
	const result = getExif(fixture);

	t.deepEqual(
		Object.keys(result),
		['0th', 'Exif', 'GPS', 'Interop', '1st', 'thumbnail'],
		'should return an object.'
	);

	t.equal(
		result.Exif[ExifIFD.Sharpness],
		777,
		'should parse Exif data.'
	);

	t.throws(
		() => getExif(true),
		/^TypeError.*Expected a buffer of JPEG of TIFF, but got a non-Buffer value true\./,
		'should throw an error when it takes a non-Buffer value.'
	);

	t.throws(
		() => getExif(Buffer.alloc(0)),
		/^RangeError.*got an empty buffer\. JPEG must be 107 bytes or more, and TIFF must be 46 bytes or more\./,
		'should throw an error when it takes an empty Buffer.'
	);

	t.throws(
		() => getExif(Buffer.alloc(45)),
		/^RangeError.*Expected a buffer of JPEG of TIFF, but got a buffer with insufficient data size 45\. /,
		'should throw an error when it takes a too small Buffer.'
	);

	t.throws(
		() => getExif(Buffer.alloc(46)),
		/^RangeError.*Expected a buffer of JPEG of TIFF, but got a buffer of neither\./,
		'should throw an error when it takes a non-image Buffer.'
	);

	t.end();
});
