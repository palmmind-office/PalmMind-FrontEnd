const fetch = require("node-fetch");
let Baseurl = process.env.baseurl;
let BaseCgPath = process.env.basecgPath;
let LocationToken = process.env.locationtoken;

// exports.getLocation = async function (req, res, next) {
//   try {
//     console.log(req.body, "ssss");

//     let latitude = req.sanitize(req.body.latitude);
//     let longitude = req.sanitize(req.body.longitude);

//     let url = `${Baseurl}&longitude=${longitude}&latitude=${latitude}`;
//     let response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });
//     let result = await response.json();

//     let sliderMaker = (resultData) => {
//       sliders = [];
//       Object.keys(resultData).forEach((element) => {
//         if (resultData[element].length > 0) {
//           resultData[element].forEach((item) => {
//             sliders.push({
//               title: item.name,
//               features: {
//                 "Store Incharge": item.store_incharge,
//                 Phone: item.phone,
//                 Location: item.location,
//               },
//               map: {
//                 coordinates: item.google_coordinates,
//               },
//             });
//           });
//         }
//       });
//       return sliders;
//     };

//     if (result && result.statusCode === 200) {
//       data = {
//         type: "generalslider",
//         title: `We have found following showrooms near your location`,
//         data: sliderMaker(result.data),
//       };
//       res.status(200).json(data);
//     } else {
//       data = {
//         type: "location",
//         title: "No showrooms found in this location",
//         img: ``,
//         for: type,
//         subtitle: "No showrooms found in this location, please send us your location for better results",
//         buttons: {
//           content: [
//             {
//               title: "Type Location",
//               type: "type_location",
//             },
//           ],
//         },
//       };

//       res.status(200).json(data);
//     }
//   } catch (err) {
//     let errorResponse = {
//       message: err.message,
//       error: err,
//     };
//     res.status(400).json(errorResponse);
//   }
// };




// exports.getLocationByCity = async function (req, res) {
//   try {
//     console.log("done>>>");
//     let location = req.sanitize(req.query.location) || req.sanitize(req.headers.location); //** */
//     console.log(location, "dd<><>");

//     //let url = `${Baseurl}/get-showroom?city=${location}`          //** */
//     let url = `${Baseurl}&longitude=27.697969691862593&latitude=85.30735441908259`;
//     let response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });
//     let result = await response.json();

//     let sliderMaker = (resultData) => {
//       sliders = [];
//       Object.keys(resultData).forEach((element) => {
//         if (resultData[element].length > 0) {
//           resultData[element].forEach((item) => {
//             sliders.push({
//               title: item.name,
//               features: {
//                 "Store Incharge": item.store_incharge,
//                 Phone: item.phone,
//                 Location: item.location,
//               },
//               map: {
//                 coordinates: item.google_coordinates,
//               },
//             });
//           });
//         }
//       });
//       return sliders;
//     };

//     if (result && result.statusCode === 200) {
//       data = {
//         type: "generalslider",
//         title: `We have found following showrooms near your location`,
//         data: sliderMaker(result.data),
//       };
//       res.status(200).json(data);
//     } else {
//       data = {
//         type: "location",
//         title: "No showrooms found in this location",
//         // img:``,
//         // for:type,
//         // subtitle: 'No showrooms found in this location, please send us your location for better results',
//         // buttons: {
//         //     content:[
//         //         {
//         //             "title": "Type Location",
//         //             "type": "type_location"
//         //         }
//         //     ]
//         // }
//       };

//       res.status(200).json(data);
//     }
//   } catch (err) {
//     console.log(err);
//     let errorResponse = {
//       message: err.message,
//       error: err,
//     };
//     res.status(400).json(errorResponse);
//   }
// };

exports.getLocationByProvince = async function (req, res) {
  try {
    let url = `${BaseCgPath}provinces?chat_bot_token=${LocationToken}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    let result = await response.json();
    return res.send(result);
  } catch (error) {
    let errorResponse = {
            message: error.message,
            error: error,
          };
          res.status(400).json(errorResponse);
  }
};

exports.getLocationByBrand = async function (req, res) {
  try {
    let url = `${BaseCgPath}brands?chat_bot_token=${LocationToken}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let result = await response.json();
    console.log(result, "rrr::");
    return res.send(result);
  } catch (error) {
    console.log(error, "err");
  }
};

exports.getLocationByDistrict = async function (req, res) {
  try {
    let url = `${BaseCgPath}districts/${req.body.province_id}?chat_bot_token=${LocationToken}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let result = await response.json();
    console.log(result, "rrr::");
    return res.send(result);
  } catch (error) {
    console.log(error, "err");
  }
};

exports.getOutlet = async function (req, res) {
  try {
    console.log(req.body, "ppppp:::");
    let url = `${BaseCgPath}outlets/${req.body.district_id}/${req.body.brand_id}?chat_bot_token=${LocationToken}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let result = await response.json();
    let sliderMaker = (resultData) => {
      sliders = [];
      resultData.forEach((item) => {
          sliders.push({
            title: item.name,
            features: {
              "Contact Person": item.contact_person,
              Phone: item.mobile_number,
              Email: item.email,
              Location: item.address,
            },
            map: {
              coordinates: item.google_coordinates,
            },
          });
        
      });
      return sliders;
    };

    if (result.length > 0) {
      data = {
        type: "generalslider",
        title: `We have found following outlets near your location`,
        data: sliderMaker(result),
      };
      res.status(200).json(data);
    } else {
      data = {
        type: "quick_reply",
        title: "Sorry there ! No outlets found in this location",
        data: []
      };

      res.status(200).json(data);
    }
    console.log(result,"pppp:::")
  } catch (error) {
    console.log(error, "err");
  }
};
