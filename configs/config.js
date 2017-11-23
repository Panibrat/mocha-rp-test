require('babel-register');
'use strict';

const rmdir = require('rmdir');

exports.config = {
	mochaOpts: {
		reporter: 'mocha-multi-reporters',
		reporterOptions: {
			reporterEnabled: 'list,mocha-rp-reporter',
			reporterOptions: {
				configOptions: {
					endpoint: 'https://rp.epam.com/api/v1',
					password: '761b273e-03a9-4f54-92a2-e58759e70572', // TODO: fill in token (from email)
					launch: '[RP2---->true TEST-23-10-17  11:38 <-----]###',
					project: 'oleksandr_panibratenko_personal'
				}
			}
		}
	},
	framework: 'mocha',
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true, // This settings makes report Portal to create multiple launches for one test run
        maxInstances: 1
    },
    specs: [ '../tests/*.spec.js' ], // there are 2 specs in the folder so 2 launches will be added into RP (need 1 launch)
	baseUrl: 'https://www.booking.com/',

    directConnect: true,
    allScriptsTimeout: 300000,
    SELENIUM_PROMISE_MANAGER: false,

    beforeLaunch() {
        rmdir('./allure-results');
        rmdir('./allure-report');

        // TODO: function call that creates new launch
    },

    async onPrepare() {
		await browser.manage().timeouts().implicitlyWait(5000);
    },

	afterLaunch() {
		// TODO: function call that finishes launch
	}
};
