const express =require('express')
const { userInterestController, userAppoinmentsController } = require('../controller/userIntrestController')
const router =express.Router()

router.post('/userInterest',userInterestController);
router.post("/appointment",userAppoinmentsController);


module.exports =router;