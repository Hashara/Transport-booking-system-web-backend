const express = require('express')
const router = express.Router()

const { bookSeats, cancelBooking, passengerViewPastBooking, passengerViewActiveBooking } = require('../controllers/booking')
const { requireSignin,ownerMiddleware, ConductorMiddleware,passengerMiddleware } = require('../controllers/auth')

router.post('/bookseats/:uid', requireSignin, passengerMiddleware, bookSeats)
router.put('/cancelbooking/:uid',requireSignin, passengerMiddleware, cancelBooking)
router.get('/getpastbookings/:uid',requireSignin,passengerMiddleware, passengerViewPastBooking)
router.get('/getactivebookings/:uid',requireSignin,passengerMiddleware, passengerViewActiveBooking)

module.exports = router;
