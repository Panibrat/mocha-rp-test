"use strict";

const mocha = require('mocha');
const path = require('path');

const fs = require('fs'); //will write lounch ID and numbers of tests to local files

const fileConfig = require('../../configs/config'); // read conf file to get Shreaded type

const isShreadedTrue = fileConfig.config.capabilities.shardTestFiles;

function RPReporter(runner, options) {

    if(isShreadedTrue) { // test if we need one Lounch
      var numberOfTests = fs.readdirSync('./tests').length; // read numbers of tests. TODO: many files and folders with tests?
    }

    mocha.reporters.Base.call(this, runner);

    let config;
    let launchId = null;
    let suiteIds = {};
    let testIds = {};

    try {
        config = options.reporterOptions.configOptions ? options.reporterOptions.configOptions : require(path.join(process.cwd(), options.reporterOptions.configFile));

    } catch (err) {
        console.error(`Failed to load config. Error: ${err}`);
    }

    let connector = new (require("./rp_connector_sync"))(config);

    runner.on('pass', function(test){
    });

    runner.on('fail', function(test, err){
        try {
            connector.sendLog(testIds[test.title], {
                level: connector.RP_LEVEL.FAILED,
                message: err.message
            });
        } catch (err) {
            console.log(`Failed to send log for item. Error: ${err}`);
        }
    });

    runner.on('start', function()  {
        try {
          if(isShreadedTrue) {
            var readedID = fs.readFileSync('LaunchId_.txt', 'utf8'); // check if we have Lounch ID
            if(readedID.length < 1) {
              let res = connector.startLaunch();
              launchId = res.body.id;
              fs.appendFileSync('LaunchId_.txt', launchId); // write new ID if need
            } else {
              launchId = readedID;
            }
            fs.appendFileSync('count_.txt', "+"); // +1 test  admitted
          } else {
            let res = connector.startLaunch(); // start new Lounch and getting ID
            launchId = res.body.id;
          }
        } catch (err) {
            console.log(`Failed to launch run. Error: ${err}`);
        }
    });

    runner.on('end', function(){
        try {
          if (isShreadedTrue) {  // if we need one Lounch
            var readedCounts = fs.readFileSync('count_.txt', 'utf8');
            if (readedCounts.length == numberOfTests) {
              connector.finishLaunch(launchId);
              fs.writeFileSync('count_.txt', ''); // cleaning our local files
              fs.writeFileSync('LaunchId_.txt', '');
            }
          } else {
            connector.finishLaunch(launchId);
          }
        } catch (err) {
            console.log(`Failed to finish run. Error: ${err}`);
        }
    });

    runner.on('suite', function(suite){
        if(suite.title === "") {
            return true;
        } else {
            try {
                let res = connector.startRootItem({
                    name: suite.title,
                    launch: launchId,
                    description: suite.fullTitle(),
                    type: connector.RP_ITEM_TYPE.SUITE
                });
                suiteIds[suite.title] = res.body.id;
            } catch (err) {
                console.log(`Failed to create root item. Error: ${err}`);
            }
        }
    });

    runner.on('suite end', function(suite){
        try {
            connector.finishItem({
                status: suite.tests.filter(test => test.state === "failed").length > 0 ? "failed" : "passed",
                id: suiteIds[suite.title]
            });
        } catch (err) {
            console.log(`Failed to create child item. Error: ${err}`);
        }
    });

    runner.on('test', function(test){
        try {
            let res = connector.startChildItem({
                name: test.title,
                launch: launchId,
                description: test.fullTitle(),
                type: connector.RP_ITEM_TYPE.TEST
            }, suiteIds[test.parent.title]);
            testIds[test.title] = res.body.id;
        } catch (err) {
            console.log(`Failed to create child item. Error: ${err}`);
        }
    });

    runner.on('pending', function (test) {
        try {
            let res = connector.startChildItem({
                name: test.title,
                launch: launchId,
                description: test.fullTitle(),
                type: connector.RP_ITEM_TYPE.TEST
            }, suiteIds[test.parent.title]);

            connector.sendLog(res.body.id, {
                level: connector.RP_LEVEL.SKIPPED,
                message: test.title
            })

            connector.finishItem({
                status: connector.RP_STATUS.SKIPPED,
                id: res.body.id
            });
        } catch (err) {
            console.log(`Failed to create child item. Error: ${err}`);
        }
    });

    runner.on('test end', function(test){
      console.log("********runner.on('test end'**********");
        try {
            connector.finishItem({
                status: test.state,
                id: testIds[test.title]
            });
        } catch (err) {
            console.log(`Failed to create child item. Error: ${err}`);
        }
    });
}

module.exports = RPReporter;
