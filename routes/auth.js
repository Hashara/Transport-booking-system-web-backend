const express = require('express')
const router = express.Router()

//import controller
const {signup} = require('../controllers/auth')

const {userSignupValidator} = require('../validator/auth')
const {runValidation} = require('../validator/index')

router.post('/signup', userSignupValidator, runValidation,signup);

module.exports = router;