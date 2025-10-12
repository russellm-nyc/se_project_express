const router = require("express").Router();
const { validateUserBody } = require("../middlewares/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserBody, updateCurrentUser);

module.exports = router;
