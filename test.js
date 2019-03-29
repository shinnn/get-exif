'use strict';

const {dump, insert} = require('piexifjs');
const getExif = require('.');
const smallestJpeg = require('smallest-jpeg');
const test = require('tape');

const SHARPNESS = '41994';
const OFFSET_TIME = '36880';
const fixture = insert(dump({
	Exif: {
		[SHARPNESS]: 777,
		[OFFSET_TIME]: '+09:00'
	}
}), smallestJpeg.toString('binary'));

test('getExif()', async t => {
	t.deepEqual(
		Object.keys(getExif(Buffer.from(fixture, 'latin1'))),
		['0th', 'Exif'],
		'should parse Exif data.'
	);

	const exif = getExif(fixture).Exif;

	t.equal(
		exif[SHARPNESS],
		777,
		'should support Buffer-to-latin1 encoded string.'
	);

	t.equal(
		exif[OFFSET_TIME],
		'+09:00',
		'should support tags introduced in Exif version 2.31.'
	);

	t.throws(
		() => getExif([-0]),
		/^TypeError.*Expected a Buffer of JPEG or a Buffer-to-latin1 encoded string of it, but got \[ -0 \] \(array\)\./u,
		'should throw an error when it takes a non-Buffer value.'
	);

	t.throws(
		() => getExif(Buffer.alloc(0)),
		/^RangeError.*got an empty Buffer\. JPEG must be 107 bytes or more\./u,
		'should throw an error when it takes an empty Buffer.'
	);

	t.throws(
		() => getExif(''),
		/^RangeError.*got '' \(empty string\)\. JPEG must be 107 bytes or more\./u,
		'should throw an error when it takes an empty string.'
	);

	t.throws(
		() => getExif(Buffer.alloc(106)),
		/^RangeError.*, but got insufficient data size 106\. /u,
		'should throw an error when it takes a too small Buffer.'
	);

	t.throws(
		() => getExif(Buffer.alloc(107)),
		/^RangeError.* got non-JPEG data <Buffer 00 00 00 \.\.\. 104 more bytes>\. /u,
		'should throw an error when it takes a non-JPEG Buffer.'
	);

	t.throws(
		() => getExif('a'.repeat(107)),
		/^RangeError.* got non-JPEG string 'aaa \.\.\.'\. Byte sequence of JPEG must starts with FF D8 FF\./u,
		'should throw an error when it takes a non-JPEG string.'
	);

	t.throws(
		() => getExif(),
		/^RangeError.*, Expected 1 argument \(<Buffer|string>\), but got no arguments\./u,
		'should throw an error when it takes a no arguments.'
	);

	t.throws(
		() => getExif('', ''),
		/^RangeError.*, Expected 1 argument \(<Buffer|string>\), but got 2 arguments\./u,
		'should throw an error when it takes too many arguments.'
	);

	t.end();
});
