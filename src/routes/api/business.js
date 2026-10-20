
const { getAllBusinessesController, getNearbyBusinessesController, getTopRatedBusinessesController, getABusinessController, getBusinessRatings } = require("../../controllers/businessController");
const {claimBusinessController} = require("../../controllers/userControllers");
const { claimBusinessSchema } = require("../../middleware/validators/user");
const requireAuth = require("../../middleware/requireAuth");
// const { registerSchema, loginSchema, authGoogleSchema } = require("../../middleware/validators/auth");

const router = require("express").Router();

router.get('/all',  getAllBusinessesController);
router.get('/one/:id', getABusinessController);
router.get('/nearby', getNearbyBusinessesController);
router.get('/top-rated', getTopRatedBusinessesController);
router.get('/ratings/:id', getBusinessRatings);
router.put('/claim', requireAuth, claimBusinessSchema, claimBusinessController);
// router.post('/', requireAuth, getCurrentUserController);
module.exports = router;