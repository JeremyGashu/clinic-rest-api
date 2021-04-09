const express = require('express')
const clinicController = require('../controllers/clinic')
const AuthMiddleware = require('../middlewares/auth_middlewares')

const router = express.Router()

router.get('/info', AuthMiddleware.clinic_logged_in, clinicController.all_information)

router.post('/add-payment', AuthMiddleware.clinic_logged_in, clinicController.add_payment)

router.post('/add-appointment', AuthMiddleware.clinic_logged_in, clinicController.add_appointment)

router.post('/add-doctor', AuthMiddleware.clinic_logged_in, clinicController.add_doctor)

router.post('/add-patient', AuthMiddleware.clinic_logged_in, clinicController.add_patient)

router.patch('/', AuthMiddleware.clinic_logged_in, clinicController.update_clinic)

router.post('/signup',  clinicController.create_clinic)



//PARSE THE CLINIC INFO FROM THE HOTEL INFO

module.exports = router