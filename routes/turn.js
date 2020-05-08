const express = require('express')
const router = express.Router()

const { addTurn,getTurnByRouteID } = require('../controllers/turn')
const { requireSignin,ownerMiddleware } = require('../controllers/auth')


router.post('/addturn/:uid',requireSignin,ownerMiddleware,addTurn);
router.get('/getturnbyroute',getTurnByRouteID)

module.exports = router;