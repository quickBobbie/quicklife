$(document).ready(function(){

	// modal windows

	$('.add_form .form_block form #write_post').on('focus', showAddpostForm);

	$('.sc_form form input[name=images]').on('change', useUploadImagesFD);

	$('.sc_form form #upload_images').on('click', showUploadImagesFD);

	$('.user_avatar').on('click', showModalAvatar);

	$('.upload_avatar .load_new form .load_file').on('click', showUploadAvatarFD);

	$('.upload_avatar .load_new form input[name=avatar]').on('change', useUploadAvatarFD);

	$('.upload_avatar .load_user img').on('click', checkImage);

	// ajax post requests

	$('#register_block form').on('submit', register);

	$('#login_block form').on('submit', auth);

	$('.status_form form').on('submit', editUserStatus);

	$('#settings form').on('submit', userSettings);

	$('.sc_form form').on('submit', uploadImageList);

	$('.upload_avatar .load_new form').on('submit', uploadAvatar);

	$('.add_form .form_block form').on('submit', addPost);

	$('.sendMessage').on('submit', sendMessage);

	// ajax get requests

	$('#search-users').on('submit', searchUsers);

	$('#select_city, #select_oldDown, #select_oldUp, input[name=gender], #select_SP, input[name=is-photo], #people_search, #submit_search').on('change', function () {
		$('#search-users').trigger('submit');
	});

});