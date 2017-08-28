var getController = require('../controllers/getController');
var postController = require('../controllers/postController');
var middleController = require('../controllers/middleController');

module.exports = router = function (app) {

	app.use(middleController.checkCookie);

	// get requests

	app.get('/', getController.createHomePage);

	app.get('/register', getController.createRegisterPage);

	app.get('/id:id', [
		getController.createUserProfile,
		getController.createSettingsPage,
		getController.createInfoPage,
		getController.createSubscribesPage,
		getController.createSubscribersPage,
		getController.createImagesPage
	]);

	app.get('/news', [
		getController.createAllNews,
		getController.createInterestingNews,
		getController.createPhotoNews
	]);

	app.get('/users', [
		getController.createFindUsersPage,
		getController.findUsers
	]);

	app.get('/messenger', [
		getController.createMessengerPage,
		getController.createMessengerUserPage
	]);

	app.get('/logout', getController.logout);

	// post requests

	app.post('/', postController.auth);

	app.post('/register', postController.registration);

	app.post('/id:id', [
		postController.editStatus,
		postController.addPost,
		postController.subscribe,
		postController.profileLike,
		postController.postLike,
		postController.userSettings,
		postController.skipUserNews,
		postController.uploadImages
	]);

	app.post('/news', [
		postController.skipNews
	]);

	app.post('/messanger', postController.sendMessage);

};