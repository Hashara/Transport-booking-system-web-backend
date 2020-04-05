const express = require('express')
require('dotenv').config();
const app = express()
// const admin = require('./firebase-admin/admin')

const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

//import routes
const authRoutes = require('./routes/auth')
const newOwnerRoutes = require('./routes/newOwner')
const mapRoutes = require('./routes/map')
// const userRoutes = require('./routes/user')

// const functions = require('firebase-functions');

app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors());//allows all origins

if(process.env.NODE_ENV = 'development'){
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
}

// route middleware
app.use('/api',authRoutes)
app.use('/api',newOwnerRoutes)
app.use('/api',mapRoutes)


const port = process.env.PORT || 8000;

app.listen(port,() =>{
    console.log(`listening  to ${port}`)
})
;