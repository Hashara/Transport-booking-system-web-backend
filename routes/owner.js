const express = require('express')
const router = express.Router()

const { requireSignin,adminMiddleware } = require('../controllers/auth');

const { getAllOwners } = require('../controllers/owner')

router.get('/getowners/:uid',requireSignin,adminMiddleware,getAllOwners)

module.exports = router;

