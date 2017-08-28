var express = require('express'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	passport = require('passport'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

// Конфигурация приложения

app
	.disable('x-powered-by')
	.set('view engine', 'jade')
	.use(express.static(__dirname + '/public'))
	.use(bodyParser.urlencoded({extended: true}))
	.use(methodOverride())
	.use(cookieParser())
	.use(session({
		secret: 'quicklife_is_social_network_developed_by_Sergey_Uschanskiy',
		key: 'q56ln-97su-913s-617e',
		cookie: {
			maxAge: 24*60*60*1000,
			httpOnly: true,
			path: '/'
		}
	}))
	.use(passport.initialize())
	.use(passport.session());

//Подключение внешних модулей приложения

var	errors = require('./modules/errors');
require('./modules/db');
require('./modules/router')(app);
require('./modules/socket')(io);

// Обработчик ошибок 404 и 500

app
	.use(errors.errPage)
	.use(errors.errData);	

// Подключение и запуск сервера

require('./modules/server')(http);