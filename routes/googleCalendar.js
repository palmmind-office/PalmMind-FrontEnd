const express = require('express')
const calendarController = require('../controller/calendarController');
const router = express.Router()

router.post('/', calendarController.editCalendarEvent)

module.exports = router;