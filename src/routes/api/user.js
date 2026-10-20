
const {  getCurrentUserController } = require("../../controllers/authController");
const { submitRatingController } = require("../../controllers/userControllers");
const requireAuth = require("../../middleware/requireAuth");
const { submitARatingSchema } = require("../../middleware/validators/user");
// const { registerSchema, loginSchema, authGoogleSchema } = require("../../middleware/validators/auth");

const router = require("express").Router();

router.get('/me', requireAuth, getCurrentUserController);
router.post('/submit-rating', requireAuth,  submitARatingSchema, submitRatingController);
// router.post('/', requireAuth, getCurrentUserController);
module.exports = router;