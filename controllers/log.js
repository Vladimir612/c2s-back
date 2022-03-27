const mongoose = require('mongoose')
const Admin = require('../models/admin')

const logHR = async (prijavaId, userId) => {
  await Admin.updateOne(
    {
      _id: mongoose.Types.ObjectId(userId),
    },
    {
      $push: {
        Izmenio: mongoose.Types.ObjectId(prijavaId),
      },
    },
    {
      runValidators: true,
    }
  )
}

module.exports = {
  logHR,
}
