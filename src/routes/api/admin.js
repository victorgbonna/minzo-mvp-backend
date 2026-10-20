
const {  registerAdminController, loginAdminController, getCurrentAdminController, approveARatingController, approveABusinessController, getAuditLogsController, bulkAddBusinessesController, getPendingRatingsController, getPendingBusinessesController } = require("../../controllers/adminController");
const requireAdminAuth = require("../../middleware/requireAdmin");
const { registerAdminSchema, loginAdminSchema, reviewRatingSchema, reviewBusinessVerificationSchema } = require("../../middleware/validators/admin");

const router = require("express").Router();

router.get('/me',  requireAdminAuth, getCurrentAdminController);
router.post('/register', registerAdminSchema, registerAdminController);
router.post('/login', loginAdminSchema, loginAdminController);
router.patch('/rating/review', requireAdminAuth, reviewRatingSchema, approveARatingController);
router.patch('/business/review', requireAdminAuth, reviewBusinessVerificationSchema, approveABusinessController);
router.get('/audit-logs/all', requireAdminAuth, getAuditLogsController);
router.post('/business/bulk-add', requireAdminAuth, bulkAddBusinessesController);
router.get('/rating/pending-all', requireAdminAuth, getPendingRatingsController);
router.get('/business/pending-all', requireAdminAuth, getPendingBusinessesController);
// router.post('/', requireAuth, getCurrentUserController);
module.exports = router;