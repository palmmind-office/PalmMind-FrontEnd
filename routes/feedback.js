const express = require('express')
const feedbackController = require('../controller/feedbackController')
const router = express.Router()

router.post('/',feedbackController.feedback)

module.exports = router;