const mongoose = require('mongoose')

const pitanje = {
  odgovor: {
    type: String,
    required: true,
  },
  ocena: {
    type: Number,
    min: 1,
    max: 10,
  },
}
const prijavaShema = new mongoose.Schema({
  imePrezime: {
    type: String,
    required: [true, 'Morate uneti ime i prezime'],
  },
  emailPriv: {
    type: String,
    required: [true, 'Morate uneti pravi email'],
    unique: true,
  },
  emailFon: {
    type: String,
    unique: true,
    sparse: true,
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
  pitanja: {
    pitanje1: pitanje,
    pitanje2: pitanje,
  },
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
  },
  izmeniliLog: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'admins',
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
      type: mongoose.Types.ObjectId,
      ref: 'admins',
    },
  ],
  napomena: {
    type: String,
  },
})

module.exports = mongoose.model('applications', prijavaShema)
