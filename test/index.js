
var events = require('events'),
    nconf = require('nconf'),
    utils = require('gebo-utils');

nconf.file({ file: './gebo.json' });

/**
 * Test the singleton pattern
 */
exports.instantiate = {

    tearDown: function(callback) {
        delete require.cache[require.resolve('..')];
        callback();
    },

    'Should return a connection instance': function(test) {
        test.expect(1);
        var mongooseConn = require('..');

        mongooseConn.get(true, function(conn) {
            test.equal(conn.name, utils.getMongoDbName(nconf.get('testEmail')));
            test.done();
          });
    },

    'Should behave as a singleton': function(test) {
        test.expect(2);
        var mongooseConn = require('..');
        
        mongooseConn.get(true, function(conn) {
            test.equal(conn.name, utils.getMongoDbName(nconf.get('testEmail')));
            var anotherDbConnection = require('..');

            anotherDbConnection.get(true, function(conn2) {
                test.equal(conn, conn2);
                test.done();
              });
          });
    },

    'Should distinguish between testing and production mode': function(test) {
        test.expect(1);
        var mongooseConn = require('..');

        // Note: the first boolean parameter has been omitted,
        // which should put it into production mode
        mongooseConn.get(function(conn) {
            test.equal(conn.name, utils.getMongoDbName(nconf.get('email')));
            test.done();
          });
    },

    'Should emit an event on connect': function(test) {
        test.expect(2);
        var mongooseConn = require('..');

        test.ok(mongooseConn instanceof events.EventEmitter);
        mongooseConn.get(true, function(conn) {});
        mongooseConn.on('mongoose-connect', function() {
            test.ok(true);
            test.done();
        });
    },
};

