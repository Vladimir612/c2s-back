const mongoose = require("mongoose");
//role
/*
  1 - mi iz IT
  2 - HR
  3 - logistika
  4 - Kompanija
*/

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
    required: true,
  },
  koordinator: {
    type: Boolean,
    default: false,
  },
  izmenio: [
    {
      type: mongoose.Types.ObjectId,
      ref: "applications",
    },
  ],
});

module.exports = mongoose.model("admins", AdminSchema);
