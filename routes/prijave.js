const express = require("express");
const router = express.Router();

const {
  getPrijave,
  postPrijava,
  oceniPrijavu,
} = require("../controllers/prijave");
const { authUser } = require("../middleware/auth");
router.route("/").get(authUser, getPrijave).post(postPrijava);

router.route("/oceni").patch(oceniPrijavu);

module.exports = router;
