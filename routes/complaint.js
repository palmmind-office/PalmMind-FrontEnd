const express = require('express');
const { complaint } = require('../controller/complainController');
const router = express.Router()

router.post('/',complaint)

module.exports = router;