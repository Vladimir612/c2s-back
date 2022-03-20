const Prijave = require("../models/prijave");

const CustomError = require("../errors/customerror");
const prijave = require("../models/prijave");
const getPrijave = async (req, res, next) => {
  const result = await Prijave.find({});

  res.json({ success: true, data: result });
};
const postPrijava = async (req, res, next) => {
  const prijava = req.body.prijava;
  const result = await Prijave.create(prijava);

  res.json({ success: true });

  const smestiUFinalno = async (req, res, next) => {
    const prijava_id = req.body.prijava_id;
    const result = await Prijave.findOne({ _id: prijava_id });
    if (result.statusHR === "neocenjen")
      throw new CustomError(
        "Ne mozete smestiti u finalno neocenjenu prijavu",
        400
      );
    else await Prijave.updateOne({ _id: prijava_id }, { statusHR: "finalno" });
    res.json({ success: true });
  };
  const vratiUOcenjeno = async (req, res, next) => {
    const prijava_id = req.body.prijava_id;
    const result = await Prijave.findOne({ _id: prijava_id });
    if (result.statusHR === "ocenjen")
      throw new CustomError("Prijava nije u finalnim", 400);
    else await Prijave.updateOne({ _id: prijava_id }, { statusHR: "ocenjen" });
    res.json({ success: true });
  };
  const staviUSmestene = async (req, res, next) => {
    const prijava_id = req.body.prijava_id;
    const result = await Prijave.findOne({ _id: prijava_id });
    if (result.statusLog === "smesteno")
      throw new CustomError("Prijava je vec smestena", 400);
    else await Prijave.updateOne({ _id: prijava_id }, { statusLog: "smesten" });
    res.json({ success: true });
  };
  const vratiUNesmestene = async (req, res, next) => {
    const prijava_id = req.body.prijava_id;
    const result = await Prijave.findOne({ _id: prijava_id });
    if (result.statusLog === "nesmesteno")
      throw new CustomError("Prijava nije smestena", 400);
    else
      await Prijave.updateOne({ _id: prijava_id }, { statusLog: "nesmesten" });
    res.json({ success: true });
  };
  const infoZaLogistiku = async (req, res, next) => {
    const infoZaLog = req.body.infoZaLog;
    const prijava_id = req.body.prijava_id;
    const result = await Prijave.updateOne({ _id: prijava_id }, infoZaLog);
    res.json({ success: true });
  };
  const izmeniNapomenu = async (req, res, next) => {
    const napomena = req.body.napomena;
    const prijava_id = req.body.prijava_id;
    const result = await Prijave.updateOne({ _id: prijava_id }, napomena);
    res.json({ success: true });
  };
  const oznaci = async (req, res, next) => {
    const prijava_id = req.body.prijava_id;
    const oznacen = await Prijave.findOne({ _id: prijava_id });

    const result = await Prijave.updateOne(
      { _id: prijava_id },
      { oznaci: !oznacen }
    );
    res.json({ success: true });
  };
};
// const oceniPrijavu = async (req, res, next) => {
//   const ocene = req.body.ocene;
//   const prijava_id = req.body.prijava_id;
//   //ocene ce biti niz objekata, svaki od objekata ima naziv pitanja i ocenu
//   const result = await Prijave.updateOne({ _id: prijava_id }, {pitanja:ocene});
//   res.json({ success: true, data: result });
// };

module.exports = {
  getPrijave,
  postPrijava,
  oceniPrijavu,
};
