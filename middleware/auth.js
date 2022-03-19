const jwt = require('jsonwebtoken')
const CustomError = require('../errors/customerror')

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer'))
    throw new CustomError('Unauthorized', 401)

  const token = authHeader.split(' ')[1]

  try {
    const result = jwt.verify(token, process.env.TOKEN_SECRET)

    /* if (!token) {
    throw new CustomError('Unauthorized', 401)
  } */
    console.log(result)
    req.user = result

    next()
  } catch (e) {
    throw new CustomError('Unauthorized', 401)
  }
}

module.exports = {
  authUser,
}
