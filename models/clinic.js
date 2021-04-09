const mongoose = require('mongoose')

const clinicSchema = new mongoose.Schema({
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
    createdAt : {
        type : mongoose.Schema.Types.Date,
        default : Date.now(),
    },
})

clinicSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "clinicId",
  })

  clinicSchema.virtual("doctors", {
    ref: "Doctor",
    localField: "_id",
    foreignField: "clinicId",
  })

  clinicSchema.virtual("patients", {
    ref: "Patient",
    localField: "_id",
    foreignField: "clinicId",
  })

  clinicSchema.virtual("payments", {
    ref: "Payment",
    localField: "_id",
    foreignField: "clinicId",
  })
  
  clinicSchema.set("toObject", { virtuals: true });
  clinicSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model('Clinic', clinicSchema)