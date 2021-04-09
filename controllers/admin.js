const Clinic = require('../models/clinic')
const Patient = require('../models/patient')
const Payment = require('../models/payment')
const {isSameDate} = require('../utils/util_functions')

exports.get_overall_info = async (req, res) => {
    let servicePaymentToday = 0
    let servicePaymentTotal = 0

    const parsedData = {}
    
    let clinics = await Clinic.find()
    let patients = await Patient.find()
    let payments = await Payment.find()
    
    clinics.forEach(clinic => {
        if(isSameDate(new Date(clinic.createdAt), new Date())) {
            servicePaymentToday += clinic.amount
        }
        servicePaymentTotal += clinic.amount
    })

    parsedData.clinics = clinics
    parsedData.patients = patients
    parsedData.payments = payments
    parsedData.servicePaymentToday = servicePaymentToday
    parsedData.servicePaymentTotal = servicePaymentTotal

    res.status(200).json(parsedData)
}