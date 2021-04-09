const Auth = require('../models/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const KEYS = require('../config/keys')

// @Purpose = Authenticate the user
// @Previlage = No
// @Required fields =  username, password
// @Optional params = No
// @ Success status code = 200
// @ Faillure Status code = 400
// @Request = POST
exports.login_users = (req, res) => {
    const {username, password} = req.body
    if(username && password) {
        Auth.find({username}).exec()
            .then(users => {
                if(users.length > 0) {
                    bcrypt.compare(password,users[0].password,(err, result) => {
                        if(err) {
                            res.status(401).json({error : true, message : 'Auth Failed!', success:false})
                        }
                        if(result) {
                            let token = jwt.sign({
                                id : users[0]._id,
                                username : users[0].username, 
                                clinicId : users[0].clinicId,
                                type : users[0].type
                            }, KEYS.JSON_WEB_TOKEN_SECRET)
                            res.status(200).json({error : false, success : true, info : {id : users[0]._id, email : users[0].email, type : users[0].type}, clinicId : users[0].clinicId, token})
                        }
                        else {
                            res.status(401).json({error : true, message : 'Auth Failed!', success:false})
                        }
                    })
                }
                else {
                    res.status(401).json({error : true, message : 'Auth Failed!', success:false})
                }
            })
            .catch(err => {
                res.status(401).json({error : true, message : 'Auth Failed!', success:false})
            })
    }
    else {
        res.status(400).json({error :true, message : 'username and password are required fields!'})
    }
}

// @Purpose = Logout the user
// @Previlage = No
// @Required fields =  No
// @Optional params = No
// @ Success status code = 200
// @Request = GET
exports.logout_admin = (req, res) => {
    res.status(200).json({
        success : true,
        error : false
    })
}