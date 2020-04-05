const express = require('express')
const router = express.Router()

//import controller
const { getRoutes } = require('../controllers/map');

router.post('/getroute',getRoutes);

module.exports = router;



