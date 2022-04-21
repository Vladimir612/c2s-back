const mongoose = require('mongoose')
const Admin = require('../models/admin')

const createAdmin = async (req, res, next) => {
  const admin = req.body.admin

  await Admin.create(admin)
  res.json({ success: true, admin })
}

module.exports = {
  createAdmin,
}
