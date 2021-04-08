const jwt = require('jsonwebtoken')
const KEYS = require('../config/keys')
const AuthTypes = require('../config/auth_types')

exports.admin_logged_in = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const authToken = authHeader && authHeader.split(' ')[1]

    if(authToken) {
        jwt.verify(authToken,KEYS.JSON_WEB_TOKEN_SECRET,(err, decode) => {
        if(err) {
            res.status(401).json({error : true, message : 'Unauthorized Personnel!'})
        }
        else{
            if(decode.type === AuthTypes.ADMIN){
                next()
            }
            else{
                res.status(401).json({error : true, message : 'Unauthorized Personnel!'})
            }
        }
    })
    }else{
        res.status(401).json({error : true, message : 'Unauthorized Personnel!'})
    }    
}