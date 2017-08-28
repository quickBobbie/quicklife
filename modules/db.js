var	mongoose = require('mongoose'),
	mongoAutoInc = require('mongoose-auto-increment'),
	dbPaarams = require('../db');

var databaseConnection = 'mongodb://' + dbPaarams.username + ':' + dbPaarams.password + '@' + dbPaarams.host + '/' + dbPaarams.database;

// Подключение к БД

mongoose.connect(databaseConnection);

var db = mongoose.connection;

// Ошибка подключения

db.on('error', function(){
	console.log('Database connection error');
});

// Успешное подключение

db.once('open', function() {
	console.log('connected to database ' + dbPaarams.database + ' [' + Date() + ' ]');
});

// Инициализация mongoose-auto-increment

mongoAutoInc.initialize(db);

module.exports = db;