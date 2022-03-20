const Prijave = require("../models/prijave");

const CustomError = require("../errors/customerror");
const getPrijave = async (req, res, next) => {
  const result = await Prijave.find({});

  res.json({ success: true, data: result });
};
const postPrijava = async (req, res, next) => {
  const prijava = req.body.prijava;
  const result = await Prijave.create(prijava);

  res.json({ success: true });
};
const oceniPrijavu = async (req, res, next) => {
  const ocene = req.body.ocene;
  const prijava_id = req.body.prijava_id;
  //ocene ce biti niz objekata, svaki od objekata ima naziv pitanja i ocenu
  const result = await Prijave.updateOne({ _id: prijava_id }, ocene);
  res.json({ success: true, data: result });
};

module.exports = {
  getPrijave,
  postPrijava,
  oceniPrijavu,
};
