const express = require('express')
const router = express.Router()

const { addTurn, getTurnByRouteID, getActiveTurnsByConductor,getPastTurns, 
    getSeatsDetailsOfTurnByPassenger,getSeatsDetailsOfTurnByConductor,getPassengerOfTheSeatByConductor,
    ownerViewActiveTurns, ownerViewPastTurns,getFullDetailedTurn } = require('../controllers/turn')
const { requireSignin,ownerMiddleware, ConductorMiddleware,passengerMiddleware } = require('../controllers/auth')


router.post('/addturn/:uid',requireSignin,ownerMiddleware,addTurn);
router.post('/getturnbyroute',getTurnByRouteID)
router.get('/getactiveturns/:uid',requireSignin,ConductorMiddleware, getActiveTurnsByConductor)
router.get('/getpastturns/:uid',requireSignin,ConductorMiddleware, getPastTurns)
router.post('/getseatsdetailspassenger/:uid',requireSignin,passengerMiddleware,getSeatsDetailsOfTurnByPassenger)
router.post('/getseatdetailsbyconductor/:uid',requireSignin,ConductorMiddleware,getSeatsDetailsOfTurnByConductor)
router.post('/getpassengerfromseat/:uid',requireSignin, ConductorMiddleware,getPassengerOfTheSeatByConductor)
router.get('/getactiveturnsbyowner/:uid',requireSignin,ownerMiddleware,ownerViewActiveTurns)
router.get('/getpastturnsbyowner/:uid',requireSignin,ownerMiddleware, ownerViewPastTurns)
router.post('/getturndetails/:uid',requireSignin,ownerMiddleware, getFullDetailedTurn)

module.exports = router;