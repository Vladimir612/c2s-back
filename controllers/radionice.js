kompanijeRadionice = {
  rajf: ['react', 'docker'],
  adacta: ['microservices'],
  semos: ['dotnet', 'mongodb', 'windows7'],
}
const CustomError = require('../errors/customerror')
const proveriRadionicaKompanija = (prijava, kompanija) => {
  if (!kompanijeRadionice.hasOwnProperty(kompanija)) {
    throw new CustomError('Kompanija sa imenom ne postoji: ' + kompanija)
  }
  for (let radionica of prijava.zelje.radionice) {
    if (kompanijeRadionice[kompanija].includes(radionica)) return true
  }

  return false
}

module.exports = {
  proveriRadionicaKompanija,
}
