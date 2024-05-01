var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");

const baseUrl = `${process.env.SOCKET_PROTOCOL}://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}`;
const baseUrlHttps = process.env.BASEPATH_HTTPS
/* GET users listing. */

const defaultSources = [
  {
    value: "web",
    name: "Web",
  },
  {
    value: "fb",
    name: "Facebook",
  },
  {
    value: "whatsapp",
    name: "Whatsapp",
  },
  {
    value: "instagram",
    name: "Instagram",
  },
  {
    value: "viber",
    name: "Viber",
  },
  {
    value: "telegram",
    name: "Telegram",
    icon: "https://cdn.pixabay.com/photo/2020/10/17/13/21/telegram-5662082_1280.png"
  }
]

router.get('/', function (req, res) {
  let url = `${baseUrl}/${process.env.BASEPATH}/settings/authUser`;
  // console.log("error");
  let responseHeader = {};
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": req.headers.authorization
    }
  })
    .then(data => {
      // console.log(data, "data while getting organization");
      responseHeader.statusCode = data.status;
      responseHeader.status = data.ok;
      responseHeader.text = data.statusText;
      return data.json();
    })
    .then(data => {
      // console.log("Getting organization data", data);
      res.status(responseHeader.statusCode).json({
        header: responseHeader,
        data: {
          id: data.organization.id,
          name: data.organization.name,
          location: data.organization.location,
          availability: data.organization.availability,
          logo: `${baseUrlHttps}/${data.organization.logo}`,
          sources:
            // data.setting.source?.filter(value => value.enable)?.map(value => ({
            //   ...value,
            //   icon: `${baseUrl}/${value.icon}`
            // })) ||
            defaultSources
        }
      });
    })
    .catch(err => {
      // console.log("ERRRORRRR!!!!!!!")
      res.status(400).json({
        header: responseHeader,
        error: err
      });
    });
});


module.exports = router;