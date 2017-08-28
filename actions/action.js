exports.formatDate = function (date) {
	var day = date.getDate(),
		month = date.getMonth() + 1,
		year = date.getFullYear();

	if (day < 10) day = '0' + day;
	if (month < 10) month = '0' + month;

	var newDate = {
		day : day,
		month : month,
		year : year
	};

	return newDate;
};

exports.getOld = function (date) {
	var now = new Date();

	var years = now.getFullYear() - date.getFullYear(),
    	months = (now.getMonth() + 1) - (date.getMonth() + 1),
    	days = now.getDate() - date.getDate();

	if (months > 0) {
		return years;
	} else if (months < 0) {
		return years - 1;
	} else {
		if (days >= 0) {
			return years;
		} else {
			return years - 1;
		}
	};
};

exports.getBirthday = function (age, method) {
	var now = new Date();

	if (method == 'down') {
		var year = now.getFullYear() - age,
			month = now.getMonth(),
			day = now.getDate();
		return new Date(year, month, day)
	}
	else if (method = 'up'){
		var year = now.getFullYear() - age -1,
			month = now.getMonth(),
			day = (now.getDate() + 1);
		return new Date(year, month, day)
	}
	else return false;
};

exports.setStrNum = function (num) {
	num = num % 10;

	if (num == 0 || num >=5) return 'фотографий';
	if (num == 1) return 'фотография';
	if (num >= 2 && num <= 4) return 'фотографии';
};