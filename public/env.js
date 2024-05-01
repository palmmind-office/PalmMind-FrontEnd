export var env = {
  Node_env:'dev',
  protocol: "http",
  server: "localhost",
  basePath: "/rest/v1/",
  port: "9010",
  socket_token: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  analyticsTest: "G-CTPDMT0KJ2",
  analyticsId: "G-Y9JK6S5BWB",
  measurementId: "G-Y9JK6S5BWB",
  source: "Organization Name",  // ----->>> here replace Name with your organization name <<<<<<--------------
  Orgimg: "images/menu/demo.png",
  clientimg: "images/ClientImg.png",
  leadMail: "thanks for your response",
  salt_key: "123456789",
  detailCrosser: "images/cross.png",
  botsource: "web",
  HomeImg: "images/menu/family.png",
  reliable_url: "https://reliablelife.com.np",
  parentUrl:'https://palmmind.com',
  BaseCgPath: 'https://crm.cgelectronics.com.np/ism/api/chatbot/',
  LocationToken : '864b19cs72h06cf77',

  // bot Name
  botName:"Palm Bot",

  //encryption key
  encrypt: {
    SECRECT_KEY:"3YhRo89pwA1h+5acNdXcyytNCvQOCMJZQwDSPEvJcksh1cc2cEVHzel6OJRUzRSN",
    SECRECT_IV:"HcvnPh0sK63u943b5IasPO3JvKgC7MqEoeMOuvWzU7Y6IJTfg3rOVkUviM1TMWkc",
    ALGORITHM:"aes-256-cbc"
  },


  // facebook app id
  facebook_app_id: "8454891074552184",

  // google client id
  google_client_id: "105204368418-84mvc22dlg16jc8n6uc3o62un226lvsq.apps.googleusercontent.com",

  //for checking if ONLiNE/Ofline Msg
  internetConnection: "Warning: make sure you have internet connections",
  // for popup show lead captures
  PopUpTime: 60, // popup show timer
  MinutePopUP: 50,  // counter update time 
  ExtendedTime: 50,
  popupMessage: "Please provide your contact information so we can use it in the future.",
  popupUserInterests: "For easier assistance, kindly let us know what you are interested in.",
  stepToPopUp: 10,
  action: 'rest/v1/user/userInterest',
  excludeRender: [
    // ---------------->>>>>>>>> here text is added to hide that from chatbot screen -------------<<<<<<<<<<<<<<<<
    "menu",
    "hamburger",
    "Get Started",
    "offer",
    "scholorship",
    "Hi",
    "/dummy_welcome",
    "greet",
    "Greet",
    "Starting Menu"
  ],

  //https://api.mapbox.com
  baseUrlMapBox:"https://api.mapbox.com/geocoding/v5/mapbox.places",
  access_token:'pk.eyJ1IjoicG1wYWxtbWluZCIsImEiOiJjbGtzMnB3ZDcwMHdkM2RxN21td254OHg0In0.Ui0hPK388PGQjCjFoK7Zag'
};

export var cookieExpire = {
  month: 12,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export var botStyle = {
  palmbotstyle: {
    styles: {
      "max-height": "90vh",
      width: "400px",
    },
  },
  iframe: {
    allow: "geolocation",
    title: "Palmbot",
    styles: {},
  },
};
export var chatHistoryExpire = 3 * 24 * 60 * 60 * 1000;
export var chatHistoryLimit = 20;
