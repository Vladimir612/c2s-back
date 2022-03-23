const { default: mongoose } = require('mongoose')

customError = require('../errors/customerror')

const errorHandler = (err, req, res, next) => {
  try {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Greska sa serverom'

    if (err instanceof mongoose.Error.ValidationError) {
      message = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ')
      statusCode = 400
    }
    if (err.code && err.code === 11000) {
      console.log(err)
      message = `Duplikat za polje: ${Object.keys(err.keyValue)}`
      statusCode = 400
    }
    res.status(statusCode).json({ success: false, message })
  } catch (e) {
    res.status(500).send('Greska sa serverom..')
  }
}

module.exports = errorHandler
