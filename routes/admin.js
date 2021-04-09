const express = require('express')
const adminController = require('../controllers/admin')
const AuthMiddlewares = require('../middlewares/auth_middlewares')

const router = express.Router()

router.get('/info', AuthMiddlewares.admin_logged_in, adminController.get_overall_info)

module.exports = router