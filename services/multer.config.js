const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.env.UPLOAD_DOCS_PATH}`);
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(/ /g, "_");
        cb(null, Date.now().toString() + "_"+Math.round(Math.random()*100)+"_" + filename);
    },
});


const upload = multer({
    storage: storage,
});

module.exports = upload;