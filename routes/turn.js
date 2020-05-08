const express = require('express')
const router = express.Router()

const { addTurn } = require('../controllers/turn')
const { requireSignin,ownerMiddleware } = require('../controllers/auth')


router.post('/addturn/:uid',requireSignin,ownerMiddleware,addTurn);

module.exports = router;