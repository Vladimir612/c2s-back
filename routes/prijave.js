const express = require('express')
const router = express.Router()

const { getPrijave, postPrijava } = require('../controllers/prijave')
const { authUser } = require('../middleware/auth')
router.route('/').get(authUser, getPrijave).post(postPrijava)

module.exports = router
