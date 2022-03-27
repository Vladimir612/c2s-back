const mongoose = require('mongoose')
//role
/*
1 - mi iz IT
2 - HR
3 - logistika
4 - Kompanija*/
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
  //unique da bude
  izmenio: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'applications',
      unique: true,
    },
  ],
})

module.exports = mongoose.model('admins', AdminSchema)
