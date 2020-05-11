const express = require('express')
const router = express.Router()

const { addTurn, getTurnByRouteID, getActiveTurnsByConductor,getPastTurns } = require('../controllers/turn')
const { requireSignin,ownerMiddleware, ConductorMiddleware } = require('../controllers/auth')


router.post('/addturn/:uid',requireSignin,ownerMiddleware,addTurn);
router.get('/getturnbyroute',getTurnByRouteID)
router.get('/getactiveturns/:uid',requireSignin,ConductorMiddleware, getActiveTurnsByConductor)
router.get('/getpastturns/:uid',requireSignin,ConductorMiddleware, getPastTurns)

module.exports = router;