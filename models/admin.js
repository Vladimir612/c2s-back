const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  lozinka: {
    type: String,
    required: true,
  },
  uloga: {
    type: String,
  },
  dozvola: {
    type: Number,
  },
  koordinator: {
    type: Boolean,
    default: false,
  },
  Izmenio: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'applications',
    },
  ],
})

module.exports = mongoose.model('admins', AdminSchema)
