const express = require('express')
const router = express.Router()

const { requireSignin,ownerMiddleware,adminMiddleware } = require('../controllers/auth');

const { sendRequest,getPendingBusRequests,rejectBus,acceptBus } = require('../controllers/newBus');

router.post('/busrequest/:uid',requireSignin,ownerMiddleware,sendRequest);
router.get('/newbusrequests/:uid',requireSignin,adminMiddleware,getPendingBusRequests);
router.put('/rejectbus/:uid',requireSignin,adminMiddleware,rejectBus);
router.post('/acceptbus/:uid',requireSignin,adminMiddleware,acceptBus)


module.exports = router;