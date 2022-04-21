const mongoose = require('mongoose')
const Admin = require('../models/admin')
const Prijava = require('../models/prijave')
const logAdmin = async (prijavaId, userId) => {
  await Admin.updateOne(
    {
      _id: mongoose.Types.ObjectId(userId),
      // da ne upisuje admina da je izmenio
    },
    {
      $addToSet: {
        izmenio: mongoose.Types.ObjectId(prijavaId),
      },
    },
    {
      runValidators: true,
    }
  )
}
const logHr = async (prijavaId, userId, session) => {
  await Prijava.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(prijavaId),
      izmeniliHr: {
        $ne: userId,
      },
    },
    {
      $push: {
        izmeniliHr: mongoose.Types.ObjectId(userId),
      },
    },
    {
      session,
    }
  )
}

module.exports = {
  logAdmin,
  logHr,
}
