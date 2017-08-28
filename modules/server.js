module.exports = server = function(http){
	var port = process.env.PORT || 3000;

	http.listen(port, function(){
			console.log('Server started on port ' + port + ' [ ' + Date() + ' ]');
		});
};