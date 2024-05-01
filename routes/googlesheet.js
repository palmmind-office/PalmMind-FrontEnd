const express = require("express");
const router = express.Router();

const {googleSheetController} = require("../controller/googleSheetController")

router.post('/googlesheet', googleSheetController)

module.exports=router