const express = require('express');
const router = express.Router();
const pushController = require('../controller/pushnotificationController');

router.post('/suscribe', pushController.poshNotification);
router.post('/unsuscribe', pushController.unsuscribe);
router.post('/getVisitors/suscribed', pushController.getSuscribeUser);

module.exports = router;