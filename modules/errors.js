// Ошибка 404

module.exports.errPage = function(req, res, next){
	res.status(404);
	res.render('error', {
		err_status : 404,
		err_description : 'Страница не существует'
	});
	next();
};

// Ошибка 500

module.exports.errData = function(err, req, res, next){
	if(err) throw err;
	res.status(500);
	res.send({
		err_code : 500,
		err_sescription : "Database error"
	})
	next();
};