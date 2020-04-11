const express = require('express')
const router = express.Router()

const { sendRequest,getPendingOwners,acceptOwner } = require('../controllers/newOwner')


const {ownerRequestValidation} = require('../validator/newOwner')
const {runValidation} = require('../validator/index')

router.post('/sendrequest',ownerRequestValidation,runValidation,sendRequest);
router.get('/newrequests',getPendingOwners)
router.post('/acceptowner',acceptOwner)

module.exports = router;