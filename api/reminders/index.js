//modules
const express = require("express");
const router = express.Router();
//routers
const userRemindersRoutes = require("./user-reminders");

router.use("/user", userRemindersRoutes);

//export
module.exports = router;
