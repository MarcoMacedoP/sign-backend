const router = require("express").Router();
const teamsUsersRoute = require("./teams-user");
const teamsAdminsRoute = require("./teams-admins");

router.use("/user", teamsUsersRoute);
router.use("/admin", teamsAdminsRoute);

module.exports = router;
