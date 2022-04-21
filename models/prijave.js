const mongoose = require('mongoose')
// objekti za semu
const pitanje = {
  odgovor: {
    type: String,
    required: true,
  },
  ocena: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
}
// za CV
const kompanijeOcene = {
  rajf: {
    type: Number,
    max: 2,
    min: 0,
  },
  adacta: {
    type: Number,
    max: 2,
    min: 0,
  },
  prime: {
    type: Number,
    max: 2,
    min: 0,
  },
  semos: {
    type: Number,
    max: 2,
    min: 0,
  },
}

//zelje i info logistika
const stavkeZelja = {
  panel: {
    type: Boolean,
    default: false,
  },
  techChallenge: {
    type: Boolean,
    default: false,
  },
  speedDating: [
    {
      type: String,
      enum: ['rajf', 'adacta', 'semos'],
    },
  ],
  radionice: [
    {
      type: String,
      enum: [
        'dotnet',
        'react',
        'svelte',
        'docker',
        'microservices',
        'mongodb',
        'windows7',
      ],
    },
  ],
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
      unique: true,
    },
    emailFon: {
      type: String,
      unique: true,
      sparse: true,
    },
    zelje: {
      type: stavkeZelja,
      required: [true, 'Zelje su obavezno polje'],
    },
    cvOcene: {
      type: {
        speedDating: {
          type: kompanijeOcene,
          default: {},
        },
        radionice: {
          type: kompanijeOcene,
          default: {},
        },
      },
      default: {},
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
    //radionica da bude samo jedna za logistiku
    infoZaLogistiku: {
      type: stavkeZelja,
      default: {},
    },
    izmeniliLog: [
      {
        type: String,
      },
    ],
    izmeniliHr: [
      {
        type: String,
      },
    ],
    izmeniliKompanija: [
      {
        type: String,
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
