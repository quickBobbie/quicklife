function submitForm (form, data, cb) {
	$.ajax({
		url : form.attr('action'),
		type : form.attr('method'),
		dataType : 'json',
		data : data,
		success : cb
	});
};

function submitFiles (form, data, cb) {
	$.ajax({
		url : form.attr('action'),
		type : form.attr('method'),
		cache: false,
        contentType: false,
        processData: false,
		data : data,
		success : cb
	});
};

function anotherSubmit (url, data, cb) {
	$.ajax({
		url : url,
		type : 'POST',
		dataType : 'json',
		data : data,
		success : cb
	});
};

function createDate (date) {

	var newDate = {
		day : date.getDate(),
		month : (date.getMonth() + 1),
		year : date.getFullYear(),
		hour : date.getHours(),
		min : date.getMinutes()
	};

	if (newDate.day < 10) newDate.day = '0' + newDate.day;
	if (newDate.month < 10) newDate.month = '0' + newDate.month;
	if (newDate.hour < 10) newDate.hour = '0' + newDate.hour;
	if (newDate.min < 10) newDate.min = '0' + newDate.min;

	return newDate;
};

function createPost (res, type) {
	var content;

	var now =  new Date(res.date);

	var postDate = createDate(now);

	if (type == 'text') {
		content = `
		<section>
			<div class="post">
				<div class="post_title">
					<div class="title_img">
						<img class="user_avatar" src="../users/` + res.author_id + `/images/` + res.author_avatar + `">
					</div>
					<div class="title_text">
						<h2>` + res.author_name + ' ' + res.author_action + `</h2>
						<span>` + postDate.day + '.' + postDate.month + '.' + postDate.year + ' в ' + postDate.hour + ':' + postDate.min + `</span>
					</div>
				</div>
				<div class="post_content">
					<div class="post_text">
						<p>` + res.text + `</p>
					</div>
				</div>
				<div class="post_actions">
					<div id="like_post">
						<a href="" class="action_but" onclick="togglePostLike(event, ` + res.post_id + `);">
							<i style='background-position: -30px 0;'></i>
							<span>` + res.likes.length + `</span>
						</a>
					</div>
					<div id="comment_count">
						<div class="action_but">
							<i style='background-position: -61px 0;'></i>
							<span>` + res.comments.length + `</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	`
	};

	if (type == 'image') {
		content = `
		<section>
			<div class="post">
				<div class="post_title">
					<div class="title_img">
						<img class="user_avatar" src="../users/` + res.author_id + `/images/` + res.author_avatar + `">
					</div>
					<div class="title_text">
						<h2>` + res.author_name + ' ' + res.author_action + `</h2>
						<span>` + postDate.day + '.' + postDate.month + '.' + postDate.year + ' в ' + postDate.hour + ':' + postDate.min + `</span>
					</div>
				</div>
				<div class="post_content">
					<img src="../users/` + res.author_id + '/images/' + res.image_name + `">
				</div>
				<div class="post_actions">
					<div id="like_post">
						<a href="" class="action_but" onclick="togglePostLike(event, ` + res.post_id + `);">
							<i style='background-position: -30px 0;'></i>
							<span>` + res.likes.length + `</span>
						</a>
					</div>
					<div id="comment_count">
						<div class="action_but">
							<i style='background-position: -61px 0;'></i>
							<span>` + res.comments.length + `</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	`
	};

	return content;
}

function addPostText (res) {
	var now =  new Date(res.date);

	var postDate = createDate(now);

	$('.content').prepend(`
		<section>
			<div class="post">
				<div class="post_title">
					<div class="title_img">
						<img class="user_avatar" src="../users/` + res.author_id + `/images/` + res.author_avatar + `">
					</div>
					<div class="title_text">
						<h2>` + res.author_name + ' ' + res.author_action + `</h2>
						<span>` + postDate.day + '.' + postDate.month + '.' + postDate.year + ' в ' + postDate.hour + ':' + postDate.min + `</span>
					</div>
				</div>
				<div class="post_content">
					<div class="post_text">
						<p>` + res.text + `</p>
					</div>
				</div>
				<div class="post_actions">
					<div id="like_post">
						<a href="" class="action_but" onclick="togglePostLike(event, ` + res.author_id + `);">
							<i style='background-position: -30px 0;'></i>
							<span>` + res.likes.length + `</span>
						</a>
					</div>
					<div id="comment_count">
						<div class="action_but">
							<i style='background-position: -61px 0;'></i>
							<span>` + res.comments.length + `</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);

	var postLn = $('#content_form .add_form .form_title span');

	var count = postLn.text().slice(postLn.text().indexOf('(') + 1, -1);
	count = Number(count);

	postLn.text('записей (' + (count + 1) + ')');
};

function addPostImage (res) {
	var now =  new Date(res.date);

	var postDate = createDate(now);

	$('.content').prepend(`
		<section>
			<div class="post">
				<div class="post_title">
					<div class="title_img">
						<img class="user_avatar" src="../users/` + res.author_id + `/images/` + res.author_avatar + `">
					</div>
					<div class="title_text">
						<h2>` + res.author_name + ' ' + res.author_action + `</h2>
						<span>` + postDate.day + '.' + postDate.month + '.' + postDate.year + ' в ' + postDate.hour + ':' + postDate.min + `</span>
					</div>
				</div>
				<div class="post_content">
					<img src="../users/` + res.author_id + '/images/' + res.image_name + `">
				</div>
				<div class="post_actions">
					<div id="like_post">
						<a href="" class="action_but" onclick="togglePostLike(event, ` + res.author_id + `);">
							<i style='background-position: -30px 0;'></i>
							<span>` + res.likes.length + `</span>
						</a>
					</div>
					<div id="comment_count">
						<div class="action_but">
							<i style='background-position: -61px 0;'></i>
							<span>` + res.comments.length + `</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);

	var postLn = $('#content_form .add_form .form_title span');

	var count = postLn.text().slice(postLn.text().indexOf('(') + 1, -1);
	count = Number(count);

	postLn.text('записей (' + (count + 1) + ')');
};

function updateUsers (res) {
	for (var i = 0; i < res.users.length; i++) {
		var avatar = `../images/avatar.png`,
			userAddCotent = ``;

		if (res.users[i].avatar) avatar = "../users/" + res.users[i].user_id + "/images/" + res.users[i].avatar;
		
		if (res.users[i].user_id != res.isUserID) {
			subContent = `<i style="background-position: -92px 0;"></i>`;

			if (res.isSub[i]) subContent = `<i style="background-position: -122px 0;"></i>`;
			
			userAddCotent = `
				<div class="people_action">
					<div id="people_add" class="toggleSubscribe" onclick="toggleSubscribe(event, ` + res.users[i].user_id + `, 1);">
						` + subContent + `	
					</div>
				</div>
			`;
		};

		$('.content').append(`
			<section>
				<div class="people">
					<img class="user_avatar" src="` + avatar + `">
					<a href="/id` + res.users[i].user_id + `" class="people_info">
						<h3>` + res.users[i].first_name +  ' ' + res.users[i].last_name + `</h3>
						<span>Лайков (` + res.users[i].likes.length + `)</span>
					</a>
					` + userAddCotent + `
				</div>
			</section>
		`);
	};
};