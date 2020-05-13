const express = require('express')
const router = express.Router()

const { addTurn, getTurnByRouteID, getActiveTurnsByConductor,getPastTurns, getSeatsDetailsOfTurnByPassenger,getSeatsDetailsOfTurnByPassengerConductor } = require('../controllers/turn')
const { requireSignin,ownerMiddleware, ConductorMiddleware,passengerMiddleware } = require('../controllers/auth')


router.post('/addturn/:uid',requireSignin,ownerMiddleware,addTurn);
router.get('/getturnbyroute',getTurnByRouteID)
router.get('/getactiveturns/:uid',requireSignin,ConductorMiddleware, getActiveTurnsByConductor)
router.get('/getpastturns/:uid',requireSignin,ConductorMiddleware, getPastTurns)
router.get('/getseatsdetailspassenger/:uid',requireSignin,passengerMiddleware,getSeatsDetailsOfTurnByPassenger)
router.get('/getseatdetailsbyconductor/:uid',requireSignin,ConductorMiddleware,getSeatsDetailsOfTurnByPassengerConductor)

module.exports = router;