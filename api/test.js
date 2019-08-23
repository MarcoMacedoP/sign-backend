const express = require("express");
const router = express.Router();
const debug = require("debug")("api:testing");

router.post("/", (req, res) => {
  testRouter(req, res);
});
router.get("/", (req, res) => {
  debug("Alguien llego por get a test.");
  testRouter(req, res);
});

function testRouter(req, res) {
  res.json({
    headers : `Estas son tus headers: ${req.headers}`,
    body    : `Este es tu body: ${req.body}`
  });
}

module.exports = router;
