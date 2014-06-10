/**
 * Adapted from http://afshinm.name/mongodb-singleton-connection-in-nodejs
 * 2014-5-28
 */
var EventEmitter = require('events').EventEmitter,
    mongoose = require('mongoose'),
    utils = require('gebo-utils');
  
var nconf = require('nconf');
nconf.file({ file: './gebo.json' });

var winston = require('winston'),
    logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({ colorize: true }) ] });

// The mongoose connection
var goose;

/**
 * This module emits the mongoose-connect event when
 * successfully connected to mongo with the 
 * mongoose driver
 */
exports = module.exports = new EventEmitter();

/**
 * Get the connected instance of mongoose
 *
 * @param bool - true for testing mode
 *
 * @return Object - mongoose instance
 */
exports.get = function(testing) {

    if (testing === undefined) {
      testing = false;
    }

    // If we already have a connection, don't connect to the database again.
    // I question whether this is really necessary...
    if (goose) {
      return goose;
    }

    var dbName = utils.getMongoDbName(nconf.get('email'));
    if (testing) {
      logger.info('gebo-mongoose is in test mode');
      dbName = utils.getMongoDbName(nconf.get('testEmail'));
    }

    /**
     * Database config
     */
    var uristring =
        process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://localhost/' + dbName;

    var mongoOptions = { db: { safe: true }};

    /**
     * Connect to mongo
     */
    mongoose.connect(uristring);

    /**
     * Events
     */
    mongoose.connection.on('open', function() {
        logger.info('Successfully established Mongoose connection to:', uristring);
        exports.emit('mongoose-connect');
     });

    mongoose.connection.on('error', function(err) {
        logger.error('No Mongoose connection:', uristring, err);
      });

    goose = mongoose;

    return mongoose;
  };

