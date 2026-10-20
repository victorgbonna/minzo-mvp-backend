
const { loginUserController, registerUserController, registerBusinessAndUserController } = require("../../controllers/authController");
const { loginUserSchema, registerUserSchema, registerUserAndBusinessSchema } = require("../../middleware/validators/auth");

const router = require("express").Router();

router.post("/sign-in",loginUserSchema, loginUserController);
router.post("/sign-up", registerUserSchema, registerUserController);
router.post('/sign-up-user-with-business', registerUserAndBusinessSchema, registerBusinessAndUserController);
module.exports = router;