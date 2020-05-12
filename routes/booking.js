const express = require('express')
const router = express.Router()

const { bookSeats, cancelBooking } = require('../controllers/booking')
const { requireSignin,ownerMiddleware, ConductorMiddleware,passengerMiddleware } = require('../controllers/auth')

router.post('/bookseats/:uid', requireSignin, passengerMiddleware, bookSeats)
router.put('/cancelbooking/:uid',requireSignin, passengerMiddleware, cancelBooking)

module.exports = router;
