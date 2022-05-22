const Prijava = require("../models/prijave");
const mongoose = require("mongoose");

const CustomError = require("../errors/customerror");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ovo treba da se doda na sve funkcije gde hocemo da logujemo
const { logHR } = require("./log");

const obrisiPrijave = async (req, res) => {
  await Prijava.deleteMany({});
  res.json({ success: true });
};

const infoZaLogistiku = async (req, res, next) => {
  let infoZaLogistiku = {};

  const { radionica, panel, techChallenge, speedDating } = req.body;
  if (radionica) {
    infoZaLogistiku.radionica = radionica;
  }
  if (panel) infoZaLogistiku.panel = panel;
  if (techChallenge) infoZaLogistiku.techChallenge = techChallenge;
  if (speedDating) infoZaLogistiku.speedDating = speedDating;

  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  if (Object.keys(infoZaLogistiku).length == 0)
    throw new CustomError("Niste naveli info za logistiku!", 400);

  const testOcenjeno = await Prijava.findOne({ _id: prijava_id });
  if (!testOcenjeno) {
    res.json({ success: false, msg: "prijava nije pronadjena" });
  }

  if (testOcenjeno.statusHR != "ocenjen") {
    throw new CustomError("Prijava nije ocenjena! Ne moze infozalog");
  }
  const result = await Prijava.updateOne(
    { _id: prijava_id },
    {
      $set: {
        infoZaLogistiku,
      },
    }
  );
  if (result.matchedCount == 0) {
    res.json({ success: false, msg: "prijava nije pronadjena" });
  }
  res.json({ success: true });
};

const dodajNapomenu = async (req, res, next) => {
  const napomenica = req.body.napomena;
  if (!napomenica) throw new CustomError("Niste naveli napomenu", 400);

  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  await Prijava.updateOne({ _id: prijava_id }, [
    {
      $set: {
        napomena: {
          $concat: ["$napomena", `${napomenica}\n`],
        },
      },
    },
  ]);
  //bez nadovezivanja
  res.json({ success: true });
};

const oznaci = async (req, res) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijava.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  await Prijava.updateOne({ _id: prijava_id }, { oznacen: !result.oznacen });
  res.json({ success: true });
};

const vratiUNesmestene = async (req, res) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijava.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  if (result.statusLogistika === "nesmesten")
    throw new CustomError("Prijava nije smestena", 400);

  await Prijava.updateOne(
    { _id: prijava_id },
    { statusLogistika: "nesmesten" }
  );
  res.json({ success: true });
};

const staviUSmestene = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijava.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  if (result.statusLogistika === "smesten")
    throw new CustomError("Prijava je vec smestena", 400);

  if (result.statusHR !== "finalno")
    throw new CustomError("Prijava nije finalna", 400);

  await Prijava.updateOne({ _id: prijava_id }, { statusLogistika: "smesten" });
  res.json({ success: true });
};

const vratiUOcenjeno = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijava.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  if (result.statusHR !== "finalno")
    throw new CustomError("Prijava nije u finalnim", 400);

  const session = await Prijava.startSession();
  await session.startTransaction();

  try {
    await Prijava.updateOne(
      { _id: prijava_id },
      {
        $set: {
          statusHR: "ocenjen",
        },
        $push: {
          izmeniliHr: req.user.userId,
        },
      }
    );

    await logHR(prijava_id, req.user.userId);
    await session.commitTransaction();
    session.endSession();
    res.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
const smestiUFinalno = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijava.findOne({
    _id: mongoose.Types.ObjectId(prijava_id),
  });

  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  const infoZaLogistiku = result.infoZaLogistiku;

  if (!infoZaLogistiku)
    throw new CustomError("Prijava nema info za logistiku!", 400);

  if (infoZaLogistiku.radionica == "")
    throw new CustomError("Popunite radionicu u info za logistiku");

  if (infoZaLogistiku.techChallenge == "")
    throw new CustomError("Popunite tech celindz u info za logistiku");

  if (infoZaLogistiku.speedDating == "")
    throw new CustomError("Popunite speed dating u info za logistiku");

  const session = await Prijava.startSession();

  try {
    await session.startTransaction();

    await Prijava.updateOne(
      { _id: prijava_id },
      {
        $set: { statusHR: "finalno" },
        $push: {
          izmeniliHr: req.user.userId,
        },
      },
      {
        session,
      }
    );

    await logHR(prijava_id, req.user.userId);

    await session.commitTransaction();
    session.endSession();
    res.json({ success: true });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();

    next(e);
  }
};

const oceniPrijavu = async (req, res) => {
  try {
    if (req.user.dozvola !== 2) {
      return res.json({
        success: false,
        message: "Nemate dozvolu za ocenjivanje",
      });
    }

    if (req.body.ocenaPanel > 25 || req.body.ocenaPanel < 0) {
      return res.json({
        success: false,
        message: "Ocena mora biti u opsegu od 0 do 25",
      });
    }

    await Prijava.updateOne(
      { _id: req.body.prijavaId },
      {
        $set: {
          "zelja.panel.ocena": req.body.ocenaPanel,
        },
      }
    );

    await logHR(req.body.prijavaId, req.user._id);

    res.json({ success: true, message: "Uspesno ste ocenili panel" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getPrijave = async (req, res, next) => {
  const result = await Prijava.find();

  res.json({ success: true, data: result });
};

const postPrijava = async (req, res, next) => {
  console.log("izmena");
  const session = await Prijava.startSession();
  session.startTransaction();

  const prijava = req.body.prijava;

  try {
    if (!prijava) throw new CustomError("Niste naveli prijavu", 400);

    if (
      prijava.zelja.techChallenge &&
      prijava.zelja.techChallenge.kompanije.length > 3
    )
      throw new CustomError(
        "Ne mozete se prijaviti na vise od 3 tech challenga",
        400
      );
    if (prijava.zelja.radionice && prijava.zelja.radionice.length > 3)
      throw new CustomError(
        "Ne mozete se prijaviti na vise od 3 radionice",
        400
      );

    const svePrijave = await Prijava.find();

    prijava.prijavaId = svePrijave.length + 1;

    if (!prijava.zelja.panel) {
      prijava.statusHR = "ocenjen";
    }

    await Prijava.create(prijava);

    const porukica = {
      to: prijava.emailPriv,
      from: "milansrdic2000@gmail.com",
      subject: "[Kompanije studentima][FONIS] Prihvaćena prijava",
      text: "Sa zadovoljstvom Vam javljamo da je vaša prijava uspešno evidentirana!",
      html: "<div><h3>Sa zadovoljstvom Vam javljamo da je vaša prijava uspešno evidentirana!</h3><p>Možeš očekivati povratnu informaciju nakon zatvaranja prijava.</p></div>",
    };

    await sgMail.send(porukica);
    console.log("mejl je poslat");

    await session.commitTransaction();
    res.json({ success: true, result: prijava });
    session.endSession();
  } catch (e) {
    await session.abortTransaction();
    res.json({ success: false, msg: e.message });
    session.endSession();
  }
};

module.exports = {
  getPrijave,
  postPrijava,
  oceniPrijavu,
  smestiUFinalno,
  vratiUOcenjeno,
  staviUSmestene,
  vratiUNesmestene,
  oznaci,
  dodajNapomenu,
  infoZaLogistiku,
  obrisiPrijave,
};
