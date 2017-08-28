function register (event) {
	submitForm($(this), $(this).serialize(), function (res) {
		console.log(res);
		if (res.regStatus == 1 || res.regStatus == 2 || res.regStatus == 3) {
			$('#container').append(`
				<div id="flash_message">
					<h2>Ошибка!</h2>
					<span>` + res.regText +`</span>
				</div>
			`);
			setTimeout(function(){
				$('#flash_message').remove()
			}, 3000);
		} else if (res.regStatus == 0) {
			$(location).attr('href', '/id' + res.uid + '?page=settings');
		};
	});
	
	event.preventDefault();
};

function auth (event) {
	submitForm($(this), $(this).serialize(), function (res) {
		if (res.authStatus == 1) {
			$('#container').append(`
				<div id="flash_message">
					<h2>Ошибка!</h2>
					<span>` + res.authText +`</span>
				</div>
			`);
			setTimeout(function(){
				$('#flash_message').remove()
			}, 3000);
		}; 
		if (res.authStatus == 0) {
			$(location).attr('href', '/news');
		};
	});
	
	event.preventDefault();
};

function editUserStatus (event) {
	data = {
		newStatus : $('.status_form form textarea').val(),
		action : 'status'
	};

	submitForm($(this), data, function (res) {
		if (res[0] != '') $('#user_profile .user_status p').text(res[0])
		else $('#user_profile .user_status p').text('О чем вы думаете?');
		$('.status_form').hide();

		if (!res[1]) return;

		addPostText(res[1]);
	});

	event.preventDefault();
};

function userSettings (event) {
	var data = {
		first_name : $('#settings form input[name=first_name]').val(),
		last_name : $('#settings form input[name=last_name]').val(),
		birthday : $('#settings form input[name=birthday]').val(),
		city : $('#settings form input[name=city]').val(),
		mar_status : $('#settings form select[name=mar_status]').val(),
		gender : $('#settings form select[name=gender]').val(),
		phone : $('#settings form input[name=phone]').val(),
		facebook : $('#settings form input[name=facebook]').val(),
		vk : $('#settings form input[name=vk]').val(),
		site : $('#settings form input[name=site]').val(),
		quote : $('#settings form textarea[name=quote]').val(),
		password_old : $('#settings form input[name=password_old]').val(),
		password_1 : $('#settings form input[name=password_1]').val(),
		password_2 : $('#settings form input[name=password_2]').val(),
		action : 'settings'
	};

	submitForm($(this), data, function (res) {
		if (res.status === 'ok') $(location).attr('href', '?page=info');
	});

	event.preventDefault();
};

function uploadImageList (event) {
	var files = $('.sc_form form input[name=images]')[0].files;

	var fd = new FormData();

	if (files.length > 10) var ln = 10
	else var ln = files.length;

	for (var i = 0; i < ln; i++) 
		fd.append('image', files[i]);

	submitFiles($(this), fd, function (res) {
		console.log(res);
		if (res.status == 'ok') {
			for (var i = 0; i < res.images.length; i++) 
				$('.photos_block').prepend(`
					<section>
						<img class="photo" src="` + res.path + `/` + res.images[i].name + `">
					</section>
				`);
		};
	});

	event.preventDefault();
};

function uploadAvatar (event) {
	var file = $('.upload_avatar .load_new form input[name=avatar]')[0].files[0];

	var fd = new FormData();

	fd.append('avatar', file);

	submitFiles($(this), fd, function (res) {
		if (res.status == 'ok') {
			if (!res.post) return;
			$('.user_avatar').attr('src', '../users/' + res.post.author_id + '/images/' + res.post.image_name);
			addPostImage(res.post);
		};

		$('.canvas').trigger('click');
	});

	event.preventDefault();
};

function addPost (event) {
	$('.add_form .form_block form #write_post').animate({height: 15}, 300, function () {
		$('.add_form .form_block form .form_controls').hide();
	});

	if ($('.add_form .form_block form #write_post').val() != '') {
		submitForm($(this), {
				action : 'post',
				text : $('.add_form .form_block form #write_post').val()
			}, 
			function (res) {

			$('.add_form .form_block form #write_post').val('');

			if (!res) return;

			addPostText(res);
		});
	};

	event.preventDefault();
};

function toggleSubscribe (event, id, status) {
	var data = {
		action : 'subscribe',
		uid : id
	};

	var i = $('.toggleSubscribe i').index(event.path[0]),
		el = $($('.toggleSubscribe i')[i]);

	anotherSubmit('/id:id', data, function (res) {
		if (status == 0) $('.toggleSubscribe').text(res.text);
		if (status == 1) {
			if (res.status) el.attr('style', 'background-position: -122px 0;')
			else el.attr('style', 'background-position: -92px 0;');
		}
	});

	event.preventDefault();
};

function toggleProfileLike (event, id) {
	var data = {
		action : 'profile_like',
		uid : id
	};

	anotherSubmit('/id:id', data, function (res) {
		if (res.status != 'ok') return;

		$('.toggleProfileLike span').text(res.likes);
	});

	event.preventDefault();
};

function togglePostLike (event, id) {
	var data = {
		action : 'post_like',
		pid : id
	};

	anotherSubmit('/id:id', data, function (res) {
		if (res.status != 'ok') return;

		$('#like_post[post=' + id + '] a span').text(res.likes);
	});

	event.preventDefault();
};

function skipNews (event, path, data) {
	anotherSubmit(path, data, function (res) {
		if (!res) return;

		for (var i = 0; i < res.length; i++) {
			if (res[i].text) $('.content').append(createPost(res[i], 'text'));
			if (res[i].image_name) $('.content').append(createPost(res[i], 'image'));
		}
	});

	event.preventDefault();
};

function sendMessage (event) {
	// var form = $(this);

	event.preventDefault();

	// $.ajax({
	// 	type : 'post',
	// 	url : '/messanger',
	// 	data : {
	// 		id : user_id,
	// 		mess_id : message_id,
	// 		user_name: name,
	// 		text: $('textarea[name=message]').val()
	// 	},
	// 	success : function (res) {
	// 		alert('Доставленно!');
	// 	}
	// });

	var mess_date = new Date();

	$('.message_block').append(`
		<div class="message_item">
			<div class="message" style="float:right">
				<div class="mess_date">
					<span>` + mess_date.getDate() + `.` + (mess_date.getMonth() + 1) + ` в ` + mess_date.getHours() + `:` + mess_date.getMinutes() + `</span>
				</div>
				<div class="mess_text" style="background: #b2ccb9;">
					<p>` + $('textarea[name=message]').val() + `</p>
				</div>
			</div>
		</div>
	`);

	$('textarea[name=message]').val('')
};