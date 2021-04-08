const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    TTN : {
        type : String,
        required : true,
    },
    userRegisteredName : {
        type : String,
        required : true
    },
    adminId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Auth',
        required : true
    },
    amount : {
        type : Number,
        required : true,
    },
    payments : {
        type : [{}],
        default : [],
    },
    doctors : {
        type : [{}],
        default : [],
    },
    departments : {
        type : [{}],
        default : [],
    },
    appointments : {
        type : [{}],
        default : [],
    },
    patients : {
        type : [{}],
        default : [],
    },
})

module.exports = mongoose.model('User', userSchema)