const express = require('express')
require('dotenv').config();
const app = express()

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


app.use(morgan('dev'));
app.use(bodyParser.json());

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


const port = process.env.PORT || 8000;

app.listen(port,() =>{
    console.log(`listening  to ${port}`)
});