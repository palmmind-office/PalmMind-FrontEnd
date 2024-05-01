var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const keys = process.env;
const baseUrl = `${keys.SOCKET_PROTOCOL}://${keys.DASHBOARD_SERVER}:${keys.DASHBOARD_PORT}`;
const catchAsync = require("../utils/catchAsync");

/* GET users listing. */

router.get("/post", function (req, res) {
  let url = `${baseUrl}/${keys.BASEPATH}/Users/liveChat`;
  // console.log("error");
  let responseHeader = {};
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((data) => {
      responseHeader.statusCode = data.status;
      responseHeader.status = data.ok;
      responseHeader.text = data.statusText;
      return data.json();
    })
    .then((data) => {
      // console.log("response data", data);
      res.status(responseHeader.statusCode).json({
        header: responseHeader,
        data: data,
      });
    })
    .catch((err) => {
      res.status(responseHeader.statusCode || 500).json({
        header: responseHeader,
        error: err,
      });
    });
});

router.patch(
  "/:id",
  catchAsync(async function (req, res) {
    const url = `${baseUrl}/${keys.BASEPATH}/Users/${req.params.id}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    // console.log(data)
    res.status(response.status).send({ data });
  })
);

router.get(
  "/:id",
  catchAsync(async function (req, res) {
    const url = `${baseUrl}/${keys.BASEPATH}/Users/${req.params.id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    });
    const data = await response.json();
    res.status(response.status).send({ data });
  })
);

//
module.exports = router;
