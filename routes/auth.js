const express = require('express')

const authController = require('../controllers/auth')

const router = express.Router()

router.post('/login', authController.login_users)

module.exports = router