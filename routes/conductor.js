const express = require('express')
const router = express.Router()

const { addConductor } = require('../controllers/conductor')

const { requireSignin,ownerMiddleware } = require('../controllers/auth')

const { addConductorValidation } = require('../validator/conductor')
const { runValidation } = require('../validator/index')

router.post('/addconductor/:uid',requireSignin,ownerMiddleware,addConductorValidation,runValidation,addConductor);

module.exports = router;
