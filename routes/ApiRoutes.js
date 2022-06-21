const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController");
const checkAuth = require("../helpers/auth").checkAuth;

router.post("/create", checkAuth, ApiController.createToughtSave);
router.get("/edit/:id", checkAuth, ApiController.editTought);
router.post("/edit/:id", checkAuth, ApiController.editToughtSave);
router.get("/dashboard", checkAuth, ApiController.dashboard);
router.post("/delete", checkAuth, ApiController.deleteTought);
router.get("/", ApiController.showToughts);
//login
router.post("/login", ApiController.loginPost);
router.post("/register", ApiController.registerPost);
router.get("/logout", ApiController.logout);

module.exports = router;
