const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const KEYS = require('./config/keys')

mongoose.connect(KEYS.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection
db.once('open', () => console.log('Databse connected!'))
db.on('error', (err) => console.log(err))

const adminRoute = require('./routes/admin')
const clinicRoute = require('./routes/clinic')
const authRoute = require('./routes/auth')

const app = express()

//MIDDLEWARES
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//ROUTES
app.use('/api/admin', adminRoute)
app.use('/api/clinics', clinicRoute)
app.use('/api/auth', authRoute)


app.get('/', (req, res) => {
    res.status(200).json({message : 'Working properly.'})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log('Server running on port 5000')
})