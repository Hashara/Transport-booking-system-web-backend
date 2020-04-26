const express = require('express')
const router = express.Router()

const { addBusType } = require('../controllers/busType')
const { requireSignin,adminMiddleware } = require('../controllers/auth')


router.post('/addtype/:uid',requireSignin,adminMiddleware,addBusType);

module.exports = router;