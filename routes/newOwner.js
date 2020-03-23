const express = require('express')
const router = express.Router()

const { sendRequest } = require('../controllers/newOwner')


const {ownerRequestValidation} = require('../validator/newOwner')
const {runValidation} = require('../validator/index')

router.post('/sendrequest',ownerRequestValidation,runValidation,sendRequest);


module.exports = router;