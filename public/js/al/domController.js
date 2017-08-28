function showAddpostForm () {
	$(this).animate({height: 55}, 300, function () {
		$('.add_form .form_block form .form_controls').show();
	});
};

function showStatusEditor () {
	if ($('.status_form').css('display') == 'none') $('.status_form').show();
};

function showUploadImagesFD (event) {
	$('.sc_form form input[name=images]').trigger('click');
	event.preventDefault();
};

function useUploadImagesFD (event) {
	$('.sc_form .uploads_images img').remove();

	var files = $(this)[0].files;

	if (files.length <= 10) var ln = files.length
	else var ln = 10;

	for (var i = 0; i < ln; i++) {
		var fr = new FileReader();
		
		fr.readAsDataURL(files[i]);

		fr.onload = function (event) {
			$('.sc_form .uploads_images').append('<img src="' + event.target.result + '"/>');
		};
	};
};

function showModalAvatar () {
	if ($('.modal_avatar').css('display') == 'none') $('.modal_avatar').show();
	$('.upload_avatar .load_new form img').attr('src', $(this).attr('src'));
};

function hideModalAvatar () {
	if ($('.modal_avatar').css('display') == 'block') $('.modal_avatar').hide();
};

function showUploadAvatarFD (event) {
	$('.upload_avatar .load_new form input[name=avatar]').trigger('click');
	event.preventDefault();
};

function useUploadAvatarFD (event) {
	var file = $(this)[0].files[0];

	var fr = new FileReader();
	
	fr.readAsDataURL(file);

	fr.onload = function (event) {
		$('.upload_avatar .load_new form img').attr('src', event.target.result);
	};
};

function checkImage (event) {
	$('.upload_avatar .load_new form img').attr('src', $(this).attr('src'));
};

function showFullImage(src) {
	$('.i_content').attr('src', src);
	$('.modal_image').show();
};