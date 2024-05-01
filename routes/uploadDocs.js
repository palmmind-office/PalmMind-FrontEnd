const express=require('express');
const { uploadDocs} = require('../controller/uploadDocument');
const router=express.Router();
const upload=require("../services/multer.config")

router.post('/uploadDocs',upload.any(),uploadDocs);
module.exports=router