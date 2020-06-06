const express = require('express')
const router = express.Router()

const { getAllRoute } = require('../controllers/route')

router.get('/getallroutes',getAllRoute)

module.exports = router;
