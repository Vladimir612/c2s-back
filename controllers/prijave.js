const Prijave = require('../models/prijave')
const mongoose = require('mongoose')

const CustomError = require('../errors/customerror')

const prijave = require('../models/prijave')

const smestiUFinalno = async (req, res, next) => {
  const prijava_id = req.body.prijava_id
  const result = await Prijave.findOne({ _id: prijava_id })
  if (result.statusHR === 'neocenjen')
    throw new CustomError(
      'Ne mozete smestiti u finalno neocenjenu prijavu',
      400
    )
  else await Prijave.updateOne({ _id: prijava_id }, { statusHR: 'finalno' })
  res.json({ success: true })
}
const vratiUOcenjeno = async (req, res, next) => {
  const prijava_id = req.body.prijava_id
  const result = await Prijave.findOne({ _id: prijava_id })
  if (result.statusHR === 'ocenjen')
    throw new CustomError('Prijava nije u finalnim', 400)
  else await Prijave.updateOne({ _id: prijava_id }, { statusHR: 'ocenjen' })
  res.json({ success: true })
}
const staviUSmestene = async (req, res, next) => {
  const prijava_id = req.body.prijava_id
  const result = await Prijave.findOne({ _id: prijava_id })
  if (result.statusLog === 'smesteno')
    throw new CustomError('Prijava je vec smestena', 400)
  else await Prijave.updateOne({ _id: prijava_id }, { statusLog: 'smesten' })
  res.json({ success: true })
}
const vratiUNesmestene = async (req, res, next) => {
  const prijava_id = req.body.prijava_id
  const result = await Prijave.findOne({ _id: prijava_id })
  if (result.statusLog === 'nesmesteno')
    throw new CustomError('Prijava nije smestena', 400)
  else await Prijave.updateOne({ _id: prijava_id }, { statusLog: 'nesmesten' })
  res.json({ success: true })
}
const infoZaLogistiku = async (req, res, next) => {
  const infoZaLog = req.body.infoZaLog
  const prijava_id = req.body.prijava_id
  const result = await Prijave.updateOne({ _id: prijava_id }, infoZaLog)
  res.json({ success: true })
}
const izmeniNapomenu = async (req, res, next) => {
  const napomena = req.body.napomena
  const prijava_id = req.body.prijava_id
  const result = await Prijave.updateOne({ _id: prijava_id }, napomena)
  res.json({ success: true })
}
const oznaci = async (req, res, next) => {
  const prijava_id = req.body.prijava_id
  const oznacen = await Prijave.findOne({ _id: prijava_id })

  const result = await Prijave.updateOne(
    { _id: prijava_id },
    { oznaci: !oznacen }
  )
  res.json({ success: true })
}

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
