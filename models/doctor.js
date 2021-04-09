const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    speciality : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
    
})

module.exports = mongoose.model('Doctor', doctorSchema)