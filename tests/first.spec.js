'use strict';

describe('First spec', () => {

	before(async () => {
		await browser.waitForAngularEnabled(false);
	});

	it('should fail test', () => {
		throw new Error('Test Failed');
	});
});