const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    id : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    phoneNo : {
        type : String,
        required : true,
    },
    lastVisit : {
        type  : mongoose.Schema.Types.Date,
        default : new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 12)),
    },
    date : {
        type : Date,
        default : Date.now(),
    },
    status : {
        type : Boolean,
        default : false,
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})

module.exports = mongoose.model('Patient', patientSchema)