const mongoose = require('mongoose')

//zelje i info logistika
const stavkeZelja = {
  panel: {
    type: {
      staBiCuli: {
        type: String,
        default: '',
      },
      ocena: {
        type: Number,
        default: 0,
        min: 0,
        max: 25,
      },
    },
    default: {},
  },
  techChallenge: {
    emailFon: {
      type: String,
      default: '',
    },
    prethodnoIskustvo: {
      type: String,
      default: '',
    },
    tehnologije: {
      type: String,
      default: '',
    },
    saKim: {
      type: String,
      default: '',
    },
    kompanije: [
      {
        type: String,
      },
    ],
  },
  radionice: {
    sveRadionice: [
      {
        type: String,
      },
    ],
    motivaciono: {
      type: String,
    },
  },
  speedDating: [
    {
      type: String,
    },
  ],
}

const infoZaLogistiku = {
  radionica: {
    type: String,
    default: '',
  },
  panel: {
    type: Boolean,
    default: false,
  },
  techChallenge: {
    type: String,
    default: '',
  },
  speedDating: {
    type: String,
    default: '',
  },
}

const prijavaShema = new mongoose.Schema(
  {
    imePrezime: {
      type: String,
      required: [true, 'Morate uneti ime i prezime'],
    },
    emailPriv: {
      type: String,
      required: [true, 'Morate uneti pravi email'],
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
    brojTelefona: {
      type: String,
      required: true,
    },
    linkCv: {
      type: String,
      required: true,
    },
    fakultet: {
      type: String,
      required: true,
    },
    godinaStudija: {
      type: String,
      required: true,
    },
    zelja: {
      type: stavkeZelja,
      required: [true, 'Zelje su obavezno polje'],
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
      type: infoZaLogistiku,
      default: {},
    },
    izmeniliLog: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'admins',
      },
    ],
    izmeniliHr: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'admins',
      },
    ],
    napomena: {
      type: String,
      default: '',
    },
  },
  {
    minimize: false,
  }
)

module.exports = mongoose.model('applications', prijavaShema)
