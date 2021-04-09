const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    billNo : {
        type : Number,
        required : true,
    },
    patientName : {
        type : String,
        required : true,
    },
    doctor : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now(),
    },
    charges : {
        type : Number,
        required : true,
    },
    vat : {
        type : String,
        required : true,
    },
    total : {
        type : Number,
        required : true,
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})

module.exports = mongoose.model('Payment', paymentSchema)