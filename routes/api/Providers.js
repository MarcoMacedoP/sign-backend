//Dependencies and resources
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Api working!" });
});
module.exports = router;
