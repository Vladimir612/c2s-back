const mongoose = require('mongoose')
const prijavaShema = new mongoose.Schema({
  imePrezime: {
    type: String,
    required: [true, 'Morate uneti ime i prezime'],
    unique: true,
  },
  emailPriv: {
    type: String,
    required: [true, 'Morate uneti pravi email'],
    unique: true,
  },
  emailFon: {
    type: String,
    unique: true,
  },
  github: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  zelje: {
    type: {
      panel: {
        type: Boolean,
      },
      techChallenge: {
        type: Boolean,
      },
      speedDating: {
        type: String,
      },
      radionica: {
        type: String,
      },
    },
    required: [true, 'Zelje su obavezno polje'],
  },
  pitanja: [
    {
      type: {
        nazivPitanja: {
          type: String,
          required: true,
        },
        odgovor: {
          type: String,
          required: true,
        },
        ocena: {
          type: Number,
          min: 1,
          max: 10,
          default: 0,
        },
      },
    },
  ],
  statusHR: {
    type: String,
    enum: ['neocenjen', 'ocenjen', 'finalno'],
    default: 'neocenjen',
  },
  statusLogistika: {
    type: String,
    enum: ['nesmesten', 'smesten'],
    default: 'nesmesten',
  },
  oznacen: {
    type: Boolean,
    default: false,
  },
  infoZaLogistiku: {
    type: {
      radionica: {
        type: String,
      },
      panel: {
        type: Boolean,
      },
    },
  },
  izmeniliLog: [
    {
      type: String,
    },
    /* {
      type: {
        mail: {
          type: String,
        },
      },
    }, */
  ],
  izmeniliHr: [
    {
      type: String,
    },
  ],
  napomena: {
    type: String,
  },
})

module.exports = mongoose.model('applications', prijavaShema)
