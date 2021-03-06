const router = require("express").Router();
const teamsMembersRoute = require("./teams-members");
const teamsAdminsRoute = require("./teams-admins");
const teamsFounderServices = require("./teams-founders");
const teamsReminders = require("./teams-reminders");

router.use("/member", teamsMembersRoute);
router.use("/admin", teamsAdminsRoute);
router.use("/founder", teamsFounderServices);
router.use("/reminders", teamsReminders);

module.exports = router;
