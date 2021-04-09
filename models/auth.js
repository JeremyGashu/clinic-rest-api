const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    type : {
        type : String,
        required : true
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        default : null
    }
})

module.exports = mongoose.model('Auth', authSchema)