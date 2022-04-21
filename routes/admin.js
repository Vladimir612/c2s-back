const express = require('express')
const { createAdmin } = require('../controllers/admin')
const { authUser } = require('../middleware/auth')
const router = express.Router()

router.route('/create').post(authUser, createAdmin)

module.exports = router
