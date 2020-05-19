const express = require('express')
const router = express.Router()

const { addTurn, getTurnByRouteID, getActiveTurnsByConductor,getPastTurns, 
    getSeatsDetailsOfTurnByPassenger,getSeatsDetailsOfTurnByPassengerConductor,getPassengerOfTheSeatByConductor } = require('../controllers/turn')
const { requireSignin,ownerMiddleware, ConductorMiddleware,passengerMiddleware } = require('../controllers/auth')


router.post('/addturn/:uid',requireSignin,ownerMiddleware,addTurn);
router.get('/getturnbyroute',getTurnByRouteID)
router.get('/getactiveturns/:uid',requireSignin,ConductorMiddleware, getActiveTurnsByConductor)
router.get('/getpastturns/:uid',requireSignin,ConductorMiddleware, getPastTurns)
router.get('/getseatsdetailspassenger/:uid',requireSignin,passengerMiddleware,getSeatsDetailsOfTurnByPassenger)
router.post('/getseatdetailsbyconductor/:uid',requireSignin,ConductorMiddleware,getSeatsDetailsOfTurnByPassengerConductor)
router.post('/getpassengerfromseat/:uid',requireSignin, ConductorMiddleware,getPassengerOfTheSeatByConductor)

module.exports = router;