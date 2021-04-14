const AuthTypes = require('../config/auth_types');
const Auth = require('../models/auth');
const Clinic = require('../models/clinic');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const KEYS = require('../config/keys');
const jwt = require('jsonwebtoken');

const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Payment = require('../models/payment');

// @Purpose = Creating Clinic info
// @Previlage = Superadmin
// @Required fields =  username, password
// @Optional params = SuperAdmin
// @ Success status code = 201
// @ Faillure Status code = 400
// @Request = POST
exports.create_clinic = (req, res) => {
	const { name, TTN, userRegisteredName, amount, username, password, confirmPassword, phoneNo} = req.body;
	if (name && TTN && userRegisteredName && amount && phoneNo && password && confirmPassword) {
		//check if the phone number is taken
		Auth.find({ username })
			.exec()
			.then((clinics) => {
				if (clinics.length >= 1) {
					// console.log(admin)
					res.status(400).json({ error: true, message: 'Email already registered' });
				} else {
					if (password !== confirmPassword) {
						res.status(400).json({
							error: true,
							message: 'Password should match the confirmation password!',
						});
					} else {
						bcrypt.hash(password, 10, (err, hashed) => {
							if (err) {
								res.status(500).json({ error: true, message: 'Internal server error encountered' });
							} else {
								let clinicId = new mongoose.Types.ObjectId();
								let adminId = new mongoose.Types.ObjectId();
								let newClinicAdmin = new Auth({
									_id: adminId,
									username,
									password: hashed,
									type: AuthTypes.CLINIC,
									clinicId,
								});
								newClinicAdmin
									.save()
									.then(() => {
										let newClinic = new Clinic({
											_id: clinicId,
											name,
											TTN,
											userRegisteredName,
											adminId: newClinicAdmin._id,
											amount,
											phoneNo
										});

										newClinic
											.save()
											.then(() => {
												res.status(201).json({
													error: false,
													message: 'Created!',
													success: true,
												});
											})
											.catch((err) => {
												console.log(err);
												res.status(500).json({
													error: true,
													message: 'Some intername error happened.',
												});
											});
									})
									.catch((err) => {
										console.log('here');
										console.log(err);
										res.status(500).json({
											error: true,
											message: 'Some intername error happened.',
										});
									});
							}
						});
					}
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: true, message: 'Some intername error happened.' });
			});
	} else {
		res.status(400).json({ error: true, message: 'Please fill all the required fields!' });
	}
};

// @Purpose = Updating Clinic info
// @Previlage = Clinic
// @Required fields =  name, TTN, userRegisteredName, amount
// @Optional params = SuperAdmin
// @ Success status code = 201
// @ Faillure Status code = 400
// @Request = PATCH
exports.update_clinic = (req, res) => {
	const { name, TTN, userRegisteredName, amount } = req.body;
	if (name && TTN && userRegisteredName && amount) {
		const authHeader = req.headers['authorization'];
		const authToken = authHeader && authHeader.split(' ')[1];
        if(authToken) {
            jwt.verify(authToken, KEYS.JSON_WEB_TOKEN_SECRET, async (err, decode) => {
                if (err) {
                    res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
                } else {
                    if (decode.type === AuthTypes.CLINIC) {
                        let clinicId = decode.clinicId;
                        
                        Clinic.findByIdAndUpdate(clinicId, {name, TTN, userRegisteredName, amount}).then(result => {
                            res.status(200).json({error : false,
                                message : 'Updated!'
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({ error: true, message: 'Internal server error!' });
                        })
                    } else {
                        res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
                    }
                }
            });
        }
        else {
            res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
        }
	} else {
		res.status(400).json({ error: true, message: 'Please fill all the required fields!' });
	}
};

// @Purpose = Get all clinic info
// @Previlage = Clinic
// @Required fields =  None
// @Optional params = None
// @ Success status code = 201
// @ Faillure Status code = 400
// @Request = GET
exports.all_information = (req, res) => {
	const authHeader = req.headers['authorization'];
	const authToken = authHeader && authHeader.split(' ')[1];

	if (authToken) {
		jwt.verify(authToken, KEYS.JSON_WEB_TOKEN_SECRET, async (err, decode) => {
			if (err) {
				res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
			} else {
				if (decode.type === AuthTypes.CLINIC) {
					let clinicId = decode.clinicId;
					const appointments = await Appointment.find({ clinicId });
					const doctors = await Doctor.find({ clinicId });
					const patients = await Patient.find({ clinicId });
					const payments = await Payment.find({ clinicId });
					Clinic.findById(clinicId)
						.exec()
						.then((result) => {
							res.status(200).json({
								error: false,
								count: result.length,
								data: {
									clinicInfo: result,
									appointments,
									doctors,
									patients,
									payments,
								},
							});
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({
								error: true,
								message: 'Some internal server error',
							});
						});
				} else {
					res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
				}
			}
		});
	} else {
		res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
	}
};

exports.add_payment = (req, res) => {
	const authHeader = req.headers['authorization'];
	const authToken = authHeader && authHeader.split(' ')[1];

	if (authToken) {
		let { billNo, patientName, doctor, charges, vat, total } = req.body;
		if (billNo && patientName && doctor && charges && vat && total) {
			jwt.verify(authToken, KEYS.JSON_WEB_TOKEN_SECRET, (err, decode) => {
				if (err) {
					res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
				} else {
					if (decode.type === AuthTypes.CLINIC) {
						let clinicId = decode.clinicId;
						let newPayment = new Payment({
							billNo,
							patientName,
							doctor,
							charges,
							vat,
							clinicId,
							total,
						});

						newPayment
							.save()
							.then(() => {
								res.status(201).json({ error: false, message: 'Created!', success: true });
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({ error: true, message: 'Some intername error happened.' });
							});
					} else {
						res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
					}
				}
			});
		} else {
			res.status(400).json({
				error: true,
				message: 'billNo, patientName, doctor, charges, vat, total should be provided.',
			});
		}
	} else {
		res.status(401).json({ error: true, message: 'Some intername error happened.' });
	}
};

exports.add_appointment = (req, res) => {
	const authHeader = req.headers['authorization'];
	const authToken = authHeader && authHeader.split(' ')[1];

	if (authToken) {
		let { name, email, date, visitTime, doctor, injury } = req.body;
		if ((name && email && date && visitTime && injury, doctor)) {
			jwt.verify(authToken, KEYS.JSON_WEB_TOKEN_SECRET, (err, decode) => {
				if (err) {
					res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
				} else {
					if (decode.type === AuthTypes.CLINIC) {
						let clinicId = decode.clinicId;
						let newAppointment = new Appointment({
							name,
							email,
							date,
							visitTime,
							doctor,
							injury,
							clinicId,
						});

						newAppointment
							.save()
							.then(() => {
								res.status(201).json({ error: false, message: 'Created!', success: true });
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({ error: true, message: 'Some intername error happened.' });
							});
					} else {
						res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
					}
				}
			});
		} else {
			res.status(400).json({
				error: true,
				message: 'name, doctor, email, date, visitTime, doctor,injury should be provided.',
			});
		}
	} else {
		res.status(401).json({ error: true, message: 'Some intername error happened.' });
	}
};

exports.add_doctor = (req, res) => {
	const authHeader = req.headers['authorization'];
	const authToken = authHeader && authHeader.split(' ')[1];

	if (authToken) {
		let { name, speciality, gender, address } = req.body;
		if (name && speciality && gender && address) {
			jwt.verify(authToken, KEYS.JSON_WEB_TOKEN_SECRET, (err, decode) => {
				if (err) {
					res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
				} else {
					if (decode.type === AuthTypes.CLINIC) {
						let clinicId = decode.clinicId;
						let newDoctor = new Doctor({
							name,
							speciality,
							gender,
							address,
							clinicId,
						});

						newDoctor
							.save()
							.then(() => {
								res.status(201).json({ error: false, message: 'Created!', success: true });
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({ error: true, message: 'Some intername error happened.' });
							});
					} else {
						res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
					}
				}
			});
		} else {
			res.status(400).json({ error: true, message: 'name, speciality, gender, address should be provided.' });
		}
	} else {
		res.status(401).json({ error: true, message: 'Some intername error happened.' });
	}
};

exports.add_patient = (req, res) => {
	const authHeader = req.headers['authorization'];
	const authToken = authHeader && authHeader.split(' ')[1];

	if (authToken) {
		let { name, id, age, address, phoneNo, status } = req.body;
		if (name && id && age && address && phoneNo && status!==null) {
			jwt.verify(authToken, KEYS.JSON_WEB_TOKEN_SECRET, (err, decode) => {
				if (err) {
					res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
				} else {
					if (decode.type === AuthTypes.CLINIC) {
						let clinicId = decode.clinicId;
						let newPatient = new Patient({
							name,
							id,
							age,
							address,
							phoneNo,
							status,
							clinicId,
						});

						newPatient
							.save()
							.then(() => {
								res.status(201).json({ error: false, message: 'Created!', success: true });
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({ error: true, message: 'Some intername error happened.' });
							});
					} else {
						res.status(401).json({ error: true, message: 'Unauthorized Personnel!' });
					}
				}
			});
		} else {
			res.status(400).json({
				error: true,
				message: 'name, id, age, address, phoneNo, status should be provided.',
			});
		}
	} else {
		res.status(401).json({ error: true, message: 'Some intername error happened.' });
	}
};
