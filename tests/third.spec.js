'use strict';

describe('Third spec', () => {

	before(async () => {
		await browser.waitForAngularEnabled(false);
	});

	it('ok 1-third test ', () => {});
	it('ok 2-third test ', () => {});
	it('ok 3-third test ', () => {});
	it('fail 4-third test ', () => {
		throw new Error('4th Test Failed');
	});
});
