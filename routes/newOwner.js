const express = require('express')
const router = express.Router()

const { sendRequest,getPendingOwners } = require('../controllers/newOwner')


const {ownerRequestValidation} = require('../validator/newOwner')
const {runValidation} = require('../validator/index')

router.post('/sendrequest',ownerRequestValidation,runValidation,sendRequest);
router.get('/newrequests',getPendingOwners)
// router.get

module.exports = router;