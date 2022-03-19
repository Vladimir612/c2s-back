const Prijave = require('../models/prijave')

const CustomError = require('../errors/customerror')
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
}
