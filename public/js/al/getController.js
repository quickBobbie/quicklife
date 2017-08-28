function searchUsers (event) {
	var data = {
		section : 'search',
		city : $('#select_city').val(),
		old_down : $('#select_oldDown').val(),
		old_up : $('#select_oldUp').val(),
		sp : $('#select_SP').val(),
		s_text : $('#people_search').val(),
	};

	for (var i = 0; i < $('input[name=gender]').length; i++) {
		if (document.getElementsByName('gender')[i].checked) data.gender = document.getElementsByName('gender')[i].value;
	};

	if ($('input[name=is-photo]').prop('checked')) {
		data.is_photo = true;
		console.log('true');
	} else {
		data.is_photo = false;
		console.log('false');
	};

	

	submitForm($(this), data, function (res) {
		$('.content section').detach();

		updateUsers(res);

		$('.form_title h2').text('Найдено ' + res.users.length + ' человек');

		console.log(res);
	});

	event.preventDefault();
};