var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db('mplayer', new Server('localhost', Connection.DEFAULT_PORT, {}));