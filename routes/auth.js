const express = require('express')
const router = express.Router()

//import controller
const {signup,activation,signin} = require('../controllers/auth')

const {userSignupValidator} = require('../validator/auth')
const {runValidation} = require('../validator/index')

router.post('/signup', userSignupValidator, runValidation,signup);
router.post('/activate',activation);
router.post('/signin',signin);

module.exports = router;