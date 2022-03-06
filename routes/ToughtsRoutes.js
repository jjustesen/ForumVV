const express = require("express");
const router = express.Router();
const ToughtsController = require("../controllers/ToughtsController");
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/create", checkAuth, ToughtsController.createTought);
router.post("/create", checkAuth, ToughtsController.createToughtSave);
router.get("/edit/:id", checkAuth, ToughtsController.editTought);
router.post("/edit", checkAuth, ToughtsController.editToughtSave);
router.get("/dashboard", checkAuth, ToughtsController.dashboard);
router.post("/delete", checkAuth, ToughtsController.deleteTought);
router.get("/", ToughtsController.showToughts);

module.exports = router;
