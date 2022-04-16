const Prijava = require("../models/prijave");
const Admin = require("../models/admin");
const mongoose = require("mongoose");

const CustomError = require("../errors/customerror");

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ovo treba da se doda na sve funkcije gde hocemo da logujemo
const { logHR } = require("./log");
const { proveriRadionicaKompanija } = require("./radionice");
const Kompanije = ["rajf", "adacta", "semos"];

const obrisiPrijave = async (req, res) => {
  await Prijave.deleteMany({});
  res.json({ success: true });
};

const infoZaLogistiku = async (req, res, next) => {
  const infoZaLogistiku = req.body.infoZaLog;
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);
  if (!infoZaLogistiku)
    throw new CustomError("Niste naveli info za logistiku!", 400);

  console.log(infoZaLogistiku);
  const result = await Prijave.updateOne(
    { _id: prijava_id },
    {
      $set: {
        infoZaLogistiku,
      },
    }
  );
  res.json({ success: true });
};
const dodajNapomenu = async (req, res, next) => {
  const napomenica = req.body.napomena;
  if (!napomenica) throw new CustomError("Niste naveli napomenu", 400);

  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijave.updateOne({ _id: prijava_id }, [
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
const oznaci = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijave.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  await Prijave.updateOne({ _id: prijava_id }, { oznacen: !result.oznacen });
  res.json({ success: true });
};
const vratiUNesmestene = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijave.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  if (result.statusLogistika === "nesmesten")
    throw new CustomError("Prijava nije smestena", 400);

  await Prijave.updateOne(
    { _id: prijava_id },
    { statusLogistika: "nesmesten" }
  );
  res.json({ success: true });
};
const staviUSmestene = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijave.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  console.log(result.statusLogistika);
  if (result.statusLogistika === "smesten")
    throw new CustomError("Prijava je vec smestena", 400);

  if (result.statusHR !== "finalno")
    throw new CustomError("Prijava nije finalna", 400);

  await Prijave.updateOne({ _id: prijava_id }, { statusLogistika: "smesten" });
  res.json({ success: true });
};
const vratiUOcenjeno = async (req, res, next) => {
  const prijava_id = req.body.prijava_id;
  if (!prijava_id) throw new CustomError("Niste naveli prijava_id!", 400);

  const result = await Prijave.findOne({ _id: prijava_id });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  if (result.statusHR !== "finalno")
    throw new CustomError("Prijava nije u finalnim", 400);

  const session = await Prijave.startSession();
  await session.startTransaction();
  try {
    await Prijave.updateOne(
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

  const result = await Prijave.findOne({
    _id: mongoose.Types.ObjectId(prijava_id),
  });
  if (!result) throw new CustomError("Navedena prijava ne postoji!", 400);

  const { pitanje1, pitanje2 } = result.pitanja;
  if (!pitanje1.ocena) throw new CustomError("Pitanje 1 nema ocenu!", 400);
  if (!pitanje2.ocena) throw new CustomError("Pitanje 2 nema ocenu!", 400);

  if (result.statusHR === "neocenjen")
    throw new CustomError(
      "Ne mozete smestiti u finalno neocenjenu prijavu",
      400
    );

  if (result.statusHR === "finalno") {
    throw new CustomError("Prijava je vec finalna!", 400);
  }
  const session = await Prijave.startSession();

  try {
    await session.startTransaction();

    await Prijave.updateOne(
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
// const oceniPrijavu = async (req, res, next) => {
//   const ocene = req.body.ocene;
//   const prijava_id = req.body.prijava_id;
//   const cvOcene = req.body.cvOcene;

//   if (!prijava_id) throw new CustomError("Niste uneli prijavu", 400);

//   const prijavaCv = await Prijave.findOne({
//     _id: mongoose.Types.ObjectId(prijava_id),
//   });
//   if (!prijavaCv) throw new CustomError("Nema ove prijave", 400);
//   //ocene ce biti objekat , ime propertija je naziv pitanja, value je
//   // ocena koja se unosi
//   let oceneZaBazu = {};

//   //ocene za pitanja
//   if (ocene) {
//     if (Object.keys(ocene).length == 0) {
//       throw new CustomError("Niste uneli nijednu ocenu", 400);
//     }
//     for (let prop in ocene) {
//       if (!Object.keys(prijavaCv.pitanja).includes(prop))
//         throw new CustomError(
//           "Uneli ste ocenu za pitanje koje ne postoji: " + prop
//         );
//       oceneZaBazu[`pitanja.${prop}.ocena`] = ocene[prop];
//     }
//   }
//   if (cvOcene) {
//     //ako smo uneli ocene za speedDating
//     if (cvOcene.speedDating) {
//       for (let prop in cvOcene.speedDating) {
//         //da li kompanija postoji uopste?
//         if (!Kompanije.includes(prop))
//           throw new CustomError("Kompanija koju ste uneli ne postoji: " + prop);
//         //ocenjujemo samo ono sto ima u zeljama
//         if (prijavaCv.zelje.speedDating.includes(prop)) {
//           oceneZaBazu[`cvOcene.speedDating.${prop}`] =
//             cvOcene.speedDating[prop];
//         } else {
//           throw new CustomError(
//             "Korisnik se nije prijavio za speedDating kod kompanije: " + prop,
//             400
//           );
//         }
//       }
//     }
//     //ako smo uneli radionice
//     if (cvOcene.radionice) {
//       for (let prop in cvOcene.radionice) {
//         if (proveriRadionicaKompanija(prijavaCv, prop)) {
//           oceneZaBazu[`cvOcene.radionice.${prop}`] = cvOcene.radionice[prop];
//         } else {
//           throw new CustomError(
//             "Korisnik se nije prijavio za radionicu navedene kompanije: " + prop
//           );
//         }
//       }
//     }
//   }

//   oceneZaBazu["statusHR"] = "ocenjen";

//   console.log(oceneZaBazu);

//   const session = await Prijave.startSession();
//   session.startTransaction();

//   try {
//     const result = await Prijave.findOneAndUpdate(
//       {
//         _id: mongoose.Types.ObjectId(prijava_id),
//       },
//       {
//         $set: oceneZaBazu,
//         $push: {
//           izmeniliHr: mongoose.Types.ObjectId(req.user.userId),
//         },
//       },
//       {
//         runValidators: true,
//         session: session,
//         new: true,
//       }
//     );
//     if (!result) throw new CustomError("Nema ove prijave", 400);

//     if (!req.user)
//       throw new CustomError("Greska prilikom autentifikacije", 401);

//     await logHR(result._id, req.user.userId);
//     await session.commitTransaction();
//     session.endSession();
//     res.json({ success: true, data: result });
//   } catch (e) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new CustomError(e.message, 400);
//   }
// };
const getPrijave = async (req, res, next) => {
  const result = await Prijave.find();

  res.json({ success: true, data: result });
};

const postPrijava = async (req, res, next) => {
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
      subject: "[C2S - Kompanije studentima], prijava",
      text: "Prijavili ste se uspešno za projekat",
      html: "<div><h3>Uspešno ste se prijavili za projekat Kompanije Studentima</h3><p>Kada se prijave budu zatvorile sačekajte naš mejl odobrenja. Pozrav!</p></div>",
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
