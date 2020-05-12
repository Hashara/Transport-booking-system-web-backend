const express = require('express')
const router = express.Router()

const { bookSeats } = require('../controllers/booking')
const { requireSignin,ownerMiddleware, ConductorMiddleware,passengerMiddleware } = require('../controllers/auth')

router.post('/bookseats/:uid', requireSignin, passengerMiddleware, bookSeats)

module.exports = router;
