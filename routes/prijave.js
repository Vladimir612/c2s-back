const express = require("express");
const router = express.Router();

const {
  getPrijave,
  postPrijava,
  oceniPrijavu,
  smestiUFinalno,
  vratiUOcenjeno,
  staviUSmestene,
  oznaci,
  vratiUNesmestene,
  dodajNapomenu,
  infoZaLogistiku,
  obrisiPrijave,
} = require("../controllers/prijave");

const { authUser } = require("../middleware/auth");
router.route("/").get(authUser, getPrijave).post(postPrijava);

router.route("/oceni").patch(authUser, oceniPrijavu);

router.route("/hr/ufinalno").patch(authUser, smestiUFinalno);

router.route("/hr/uocenjeno").patch(authUser, vratiUOcenjeno);

router.route("/log/usmestene").patch(authUser, staviUSmestene);
router.route("/log/unesmestene").patch(authUser, vratiUNesmestene);

router.route("/oznaci").patch(authUser, oznaci);

router.route("/napomena").patch(authUser, dodajNapomenu);

router.route("/infozalog").patch(authUser, infoZaLogistiku);

router.route("/obrisisve").delete(authUser, obrisiPrijave);

module.exports = router;
