const express = require('express');
const router = express.Router();
const LocationController = require('../controller/locationController')


// router.post('/showroom/',LocationController.getLocation);
// router.get ('/showroom-city', LocationController.getLocationByCity)
router.get('/province', LocationController.getLocationByProvince)
router.get('/brand', LocationController.getLocationByBrand)
router.post('/district', LocationController.getLocationByDistrict)
router.post('/outlet',LocationController.getOutlet)

module.exports = router;
