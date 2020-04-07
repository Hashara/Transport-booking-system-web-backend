const express = require('express')
const router = express.Router()

//import controller
const { getRoutes } = require('../controllers/map');

//import validator
const {checkInputs} = require('../validator/map')
const {runValidation} = require('../validator/index')


router.post('/getroute',checkInputs,runValidation,getRoutes);

module.exports = router;



