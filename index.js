const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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
const ConductorRoutes = require('./routes/conductor')
const busTypeRoute = require('./routes/busType')
const newBusRoute = require('./routes/newBus')
const BusRoute = require('./routes/bus')
const TurnRoute = require('./routes/turn')
const bookingRouter = require('./routes/booking')

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
app.use('/api',ConductorRoutes)
app.use('/api',busTypeRoute)
app.use('/api',newBusRoute)
app.use('/api',BusRoute)
app.use('/api',TurnRoute)
app.use('/api',bookingRouter)


// const port = process.env.PORT || 8000;

// app.listen(port,() =>{
//     console.log(`listening  to ${port}`)
// });

// module.exports = app;
exports.app = functions.https.onRequest(app);