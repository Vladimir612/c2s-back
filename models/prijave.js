const mongoose = require("mongoose");

//zelje i info logistika
const stavkeZelja = {
  panel: {
    type: {
      staBiCuli: {
        type: String,
        default: "",
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
  techChallenge: [
    {
      fonMejl: {
        type: String,
        unique: true,
        default: "",
      },
      prethodnoIskustvo: {
        type: String,
        default: "",
      },
      tehnologije: {
        type: String,
        default: "",
      },
      saKim: {
        type: String,
        default: "",
      },
      kompanija: {
        type: String,
        default: "",
      },
    },
  ],
  radionice: [
    {
      type: {
        naziv: {
          type: String,
          default: "",
        },
        motivaciono: {
          type: String,
          default: "",
        },
      },
    },
  ],
  speedDating: [
    {
      type: String,
      enum: ["raiffeisen", "adacta", "semos", "eyesee", "prime", "a1"],
    },
  ],
};

const infoZaLogistiku = {
  radionica: {
    type: String,
    required: true,
  },
  panel: {
    type: Boolean,
    required: true,
  },
  techChallenge: {
    type: String,
    required: true,
  },
  speedDating: {
    type: String,
    required: true,
  },
};

const prijavaShema = new mongoose.Schema(
  {
    imePrezime: {
      type: String,
      required: [true, "Morate uneti ime i prezime"],
    },
    emailPriv: {
      type: String,
      required: [true, "Morate uneti pravi email"],
      unique: true,
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
    brojTelefona: {
      type: String,
      required: true,
    },
    linkCV: {
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
      required: [true, "Zelje su obavezno polje"],
    },
    statusHR: {
      type: String,
      enum: ["neocenjen", "ocenjen", "finalno"],
      default: "neocenjen",
    },
    statusLogistika: {
      type: String,
      enum: ["nesmesten", "smesten"],
      default: "nesmesten",
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
        ref: "admins",
      },
    ],
    izmeniliHr: [
      {
        type: mongoose.Types.ObjectId,
        ref: "admins",
      },
    ],
    napomena: {
      type: String,
      default: "",
    },
  },
  {
    minimize: false,
  }
);

module.exports = mongoose.model("applications", prijavaShema);
