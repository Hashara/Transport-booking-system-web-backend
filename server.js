const admin = require('firebase-admin')
const serviceAccount = require("./serviceAccountKey.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

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
const BusRoute = require('./routes/bus')
const TurnRoute = require('./routes/turn')
const bookingRouter = require('./routes/booking')
const ownerRouter = require('./routes/owner')
const routeRouter = require('./routes/route')

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
app.use('/api',BusRoute)
app.use('/api',TurnRoute)
app.use('/api',bookingRouter)
app.use('/api',ownerRouter)
app.use('/api',routeRouter)

app.get('*', function (req, res, next) {
    var requestTime = new Date().getTime(),
          executionTime;
  
    setTimeout(() => {
      res.send({
        requestTime,
        executionTime
      });
    }, 10000);
  });

  app.post('*', function (req, res, next) {
    var requestTime = new Date().getTime(),
          executionTime;
  
    setTimeout(() => {
      res.send({
        requestTime,
        executionTime
      });
    }, 10000);
  });

const port = process.env.PORT || 8000;

app.listen(port,() =>{
    console.log(`listening  to ${port}`)
});