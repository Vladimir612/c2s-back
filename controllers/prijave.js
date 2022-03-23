const Prijave = require('../models/prijave')
const mongoose = require('mongoose')

const CustomError = require('../errors/customerror')

const oceniPrijavu = async (req, res, next) => {
  const ocene = req.body.ocene
  const prijava_id = req.body.prijava_id
  //ocene ce biti objekat , ime propertija je naziv pitanja, value je
  // ocena koja se unosi
  console.log(ocene)
  let oceneZaBazu = {}

  for (let prop in ocene) {
    console.log(prop)
    oceneZaBazu[`pitanja.${prop}.ocena`] = ocene[prop]
  }

  const result = await Prijave.updateOne(
    {
      _id: mongoose.Types.ObjectId(prijava_id),
    },
    {
      $set: oceneZaBazu,
    },
    {
      runValidators: true,
    }
  )
  res.json({ success: true, data: result })
}
const getPrijave = async (req, res, next) => {
  const result = await Prijave.find({})

  res.json({ success: true, data: result })
}
const postPrijava = async (req, res, next) => {
  const prijava = req.body.prijava
  const result = await Prijave.create(prijava)

  res.json({ success: true })
}
module.exports = {
  getPrijave,
  postPrijava,
  oceniPrijavu,
}
