const express = require('express')
const router = express.Router()

const { getBusesByOwnerId } = require('../controllers/bus')
const { requireSignin,ownerMiddleware } = require('../controllers/auth')


router.get('/getbuses/:uid',requireSignin,ownerMiddleware,getBusesByOwnerId);

module.exports = router;