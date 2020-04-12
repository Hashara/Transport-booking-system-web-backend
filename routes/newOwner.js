const express = require('express')
const router = express.Router()

const { sendRequest,getPendingOwners,acceptOwner,rejectOwner } = require('../controllers/newOwner')

const { requireSignin,adminMiddleware } = require('../controllers/auth')

const {ownerRequestValidation} = require('../validator/newOwner')
const {runValidation} = require('../validator/index')

router.post('/sendrequest',ownerRequestValidation,runValidation,sendRequest);
router.get('/newrequests/:uid',requireSignin,adminMiddleware,getPendingOwners)
router.post('/acceptowner/:uid',requireSignin,adminMiddleware,acceptOwner)
router.post('/rejectowner/:uid',requireSignin,adminMiddleware,rejectOwner)


module.exports = router;