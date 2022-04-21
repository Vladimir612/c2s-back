const CustomError = require('../errors/customerror')
const Admin = require('../models/admin')

const authUser = async (req, res, next) => {
  const userId = req.headers.userid

  if (!userId) throw new CustomError('Unauthorized', 401)

  try {
    const user = await Admin.findOne({ _id: userId })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Ne postoji taj admin u bazi' })
    }

    req.user = user

    next()
  } catch (e) {
    throw new CustomError('Unauthorized', 401)
  }
}

module.exports = {
  authUser,
}
