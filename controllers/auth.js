const CustomError = require('../errors/customerror')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email) {
    throw new CustomError('Morate uneti email', 401)
  }
  if (!password) {
    throw new CustomError('Morate uneti sifru', 401)
  }

  const result = await Admin.findOne({ email })
  if (!result) {
    throw new CustomError('Ne postoji user sa ovim emailom', 401)
  }

  if (result.lozinka !== password) throw new CustomError('Pogresna sifra!', 401)

  const user = {
    userId: result._id,
    email: result.email,
  }
  const token = jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: 10000,
  })

  res.json({ success: true, user, token })
}

module.exports = {
  login,
}
