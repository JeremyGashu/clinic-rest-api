const express = require('express')
const clinicController = require('../controllers/clinic')

const router = express.Router()

router.post('/signup', clinicController.create_clinic)

//PARSE THE CLINIC INFO FROM THE HOTEL INFO




module.exports = router