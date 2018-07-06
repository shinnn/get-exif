'use strict';

const {dump, ExifIFD, insert} = require('piexifjs');
const getExif = require('.');
const smallestJpeg = require('smallest-jpeg');
const test = require('tape');

const fixture = insert(dump({
	Exif: {
		[ExifIFD.Sharpness]: 777
	}
}), smallestJpeg.toString('binary'));

test('getExif()', async t => {
	t.deepEqual(
		Object.keys(getExif(Buffer.from(fixture, 'binary'))),
		['0th', 'Exif', 'GPS', 'Interop', '1st', 'thumbnail'],
		'should parse Exif data.'
	);

	t.equal(
		getExif(fixture).Exif[ExifIFD.Sharpness],
		777,
		'should support Buffer-to-latin1 encoded string.'
	);

	t.throws(
		() => getExif(true),
		/^TypeError.*Expected a Buffer of JPEG or a Buffer-to-latin1 encoded string of it, but got true\./,
		'should throw an error when it takes a non-Buffer value.'
	);

	t.throws(
		() => getExif(Buffer.alloc(0)),
		/^RangeError.*got an empty Buffer\. JPEG must be 107 bytes or more\./,
		'should throw an error when it takes an empty Buffer.'
	);

	t.throws(
		() => getExif(''),
		/^RangeError.*got '' \(empty string\)\. JPEG must be 107 bytes or more\./,
		'should throw an error when it takes an empty string.'
	);

	t.throws(
		() => getExif(Buffer.alloc(106)),
		/^RangeError.*, but got insufficient data size 106\. /,
		'should throw an error when it takes a too small Buffer.'
	);

	t.throws(
		() => getExif(Buffer.alloc(107)),
		/^RangeError.*, but got a Buffer of neither\./,
		'should throw an error when it takes a non-image Buffer.'
	);

	t.end();
});
