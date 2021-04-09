const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        required : true,
    },
    visitTime : {
        type : String,
        required : true,
    },
    doctor : {
        type : String,
        required : true,
    },
    injury : {
        type : String,
        required : true,
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})

module.exports = mongoose.model('Appointment', appointmentSchema)