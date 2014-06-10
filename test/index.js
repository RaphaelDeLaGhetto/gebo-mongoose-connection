
var events = require('events'),
    nconf = require('nconf'),
    utils = require('gebo-utils');

nconf.file({ file: './gebo.json' });

/**
 * get
 *
 * Note: this will log a lot of errors. I don't think this matters,
 * because the errors seem to be a result of the deletion of the
 * module out of require.cache (which presumably causes the DB
 * to disconnect immediately)
 */
exports.get = {

    tearDown: function(callback) {
        delete require.cache[require.resolve('..')];
        callback();
    },

    'Should distinguish between testing and production mode': function(test) {
        test.expect(1);
        var mongooseConn = require('..');

        var mongoose = mongooseConn.get();
        mongooseConn.once('mongoose-connect', function() {
            test.equal(mongoose.connection.name, utils.getMongoDbName(nconf.get('email')));
            mongoose.connection.db.close();
            test.done();
          });
    },


    'Should return a connection instance': function(test) {
        test.expect(1);
        var mongoose = require('..').get(true);

        test.equal(mongoose.connection.name, utils.getMongoDbName(nconf.get('testEmail')));
        test.done();
    },

    'Should behave as a singleton': function(test) {
        test.expect(2);
        var mongoose = require('..').get(true);

        test.equal(mongoose.connection.name, utils.getMongoDbName(nconf.get('testEmail')));
        var anotherDbConnection = require('..').get(true);

        test.equal(anotherDbConnection.connection, mongoose.connection);
        test.done();
    },

    'Should emit an event on connect': function(test) {
        test.expect(2);
        var mongooseConn = require('..');

        test.ok(mongooseConn instanceof events.EventEmitter);
        var mongoose = mongooseConn.get(true);
        mongooseConn.on('mongoose-connect', function() {
            test.ok(true);
            mongoose.connection.db.close();
            test.done();
          });
    },
};

