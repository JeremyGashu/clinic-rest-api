const AuthTypes = require('../config/auth_types')
const Auth = require('../models/auth')
const Clinic = require('../models/clinic')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// @Purpose = Creating Clinic info
// @Previlage = Superadmin
// @Required fields =  username, password
// @Optional params = SuperAdmin
// @ Success status code = 201
// @ Faillure Status code = 400
// @Request = POST
exports.create_clinic = (req, res) => {

    const {name, TTN, userRegisteredName,amount, username, password , confirmPassword} = req.body
    if(name && TTN && userRegisteredName && amount) {
        //check if the phone number is taken
        Auth.find({username}).exec()
        .then(clinics => {
            if(clinics.length >= 1) {
                // console.log(admin)
                res.status(400).json({error :true , message : 'Email already registered'})
            }
            else{
                if(password.length < 8 || password !== confirmPassword) {
                    res.status(400).json({error : true, message : 'Password should be at least 8 characters and match the confirmation password!'})
                }
                else {
                    bcrypt.hash(password,10,(err, hashed) => {
                        if(err) {
                            res.status(500).json({error : true, message : 'Internal server error encountered'})
                        }
                        else {
                            let newClinicAdmin = new Auth({
                                _id : new mongoose.Types.ObjectId(),
                                username,
                                password : hashed,
                                type : AuthTypes.CLINIC
                            })
                            newClinicAdmin.save().then(() => {

                                let newClinic = new Clinic({
                                    name,
                                    TTN,
                                    userRegisteredName,
                                    adminId : newClinicAdmin._id,
                                    amount,

                                })

                                newClinic.save().then(() => {
                                    res.status(201).json({error : false, message:'Created!',success : true})
                                }).catch(err => {
                                    console.log(err)
                                    res.status(500).json({error : true, message : 'Some intername error happened.'})
                                })
                            })
                            .catch(err => {
                                console.log("here")
                                console.log(err)
                                res.status(500).json({error : true, message : 'Some intername error happened.'})})
                        }
                    })
                }
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json({error : true, message : 'Some intername error happened.'})
        })        
    }
    else {
        res.status(400).json({error :true, message : 'Please fill all the required fields!'})
    }
}
//get payments
//get appointments
//get doctors
//get department
//get patient

//add payment
//add appointment
//add doctor
//add department
//add patient