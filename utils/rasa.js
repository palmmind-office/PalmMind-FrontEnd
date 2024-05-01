const ServerServices = require("../services/server.services");
const { interveneRasa: interveneRasaFb } = require("../bot/facebook.bot");
const { rasaServerDown } = require("../socket/messages");

const localData = require("../localDataJson/localrundata");
const { getCalendar } = require("../controller/calendarController");
const sourceMap = {
  web: "rest",
  fb: "facebook",
  instagram: "instagram",
  whatsapp: "whatsapp",
  viber: "viber",
  telegram: "telegram"
};

class RasaAPI {
  constructor({ host, port, protocol }) {
    this.responseServerDown = {
      title: rasaServerDown.text,
      type: "quick_reply",
      data: rasaServerDown.buttons
    };
    this.previousUtter = null;
    // console.log(utterURL)
    this.baseUrl = protocol + "://" + host + ":" + port;
    // this.baseUrl='https://61db-111-119-49-134.ngrok-free.app'
  }
  //check if visitors form is activated in rasa or not
  async checkRasaFormStatus(sender = null, headers = {}, payload) {
    let url = `${this.baseUrl}/conversations/${sender}/tracker`;
    try {
      if (!sender || payload.startsWith('/')) { throw new Error("No sender") }
      const res = await ServerServices.getFromServer(url, headers);
      let responseData = await res.json();
      if (responseData && Object.keys(responseData?.active_loop).length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // console.log(err)
      return false
    }
  }
  async getIntentRequest(payload, metadata, maxRetries = 2) {
    console.log(payload, "payload<<<<<<<")
    const source = metadata?.source || "web";
    const sender = metadata?.sender || metadata.visitorId;
    const url = this.baseUrl + `/webhooks/${sourceMap[source]}/webhook`;

    const fbPayloadIntervened = (source === 'fb' || source === 'instagram') && interveneRasaFb(payload.payload? payload.payload : payload);
    if (fbPayloadIntervened) {
      return fbPayloadIntervened;
    }

    const headers = { "Content-Type": "application/json" };
    const body = { sender, message: payload, metadata };

    let retryCount = 0;
    let responseData;

    // while (retryCount < maxRetries) {
    try {
      if (!payload) {
        return;
      }
      else if(payload ==='See our Chatbots'){
        return localData.ourProducts
      }
      else if(payload ==='Banking'){
        return localData.banking
      }
      else if(payload ==='Insurance'){
        return localData.insurance
      }
      else if(payload ==='Automotive'){
        return localData.automotive
      }
      else if(payload ==='Colleges'){
        return localData.colleges
      }
      else if(payload ==='Government'){
        return localData.government
      }
      else if(payload ==='Education Consultancies'){
        return localData.consultancy
      }
      else if(payload ==='Know More'){
        return localData.knowMore
      }
      // else if(payload ==='Book a Demo'){
      //   //calendar
      //   const bookDemo = await getCalendar();
      //   return bookDemo;
      // }
      else if(payload ==='Contact Us'){
        return localData.contact
      }
      else if(payload ==='Jobs'){
        return localData.lookJob
      }
      else if(payload ==='Full Time Job'){
        return localData.fullTimeJob
      }
      else if(payload ==='Internship'){
        return localData.internship
      }
      else if(payload ==='Apply for Position'){
        return localData.applyJob
      }
      else if(payload ==='Apply Now'){
        return localData.applyNow
      }
      else if(payload ==='Get a free Trial'){
        return localData.getFreeTrial
      }
      else if(payload ==='Get Free Trial Form'){
        return localData.getFreeTrialForm
      }
      let isFormActivated = await this.checkRasaFormStatus(sender, headers, payload)
      if (isFormActivated) {
        const response = await ServerServices.postToServer(url, body, headers);
        responseData = await response.json();
        console.log(responseData)
      }
      else {

        responseData = await this.callOpenAi(payload, sender, source, headers);
        //check response for agent check
        if (responseData && Object.keys(responseData[0]).includes('call_rasa')) {
          body['message'] = responseData[0].call_rasa.payload || payload
          if (responseData[0].call_rasa.metadata) {
            body['metadata'] = { ...metadata, ...responseData[0].call_rasa.metadata }
          }
          const response = await ServerServices.postToServer(url, body, headers);
          let responseDataApi = await response.json();
          responseData = responseDataApi
        }
        if (responseData[0].translated && responseData[0].text === 'wait a moment') {
          payload = responseData[0].translated;
          console.log("translated query", payload);
          responseData = await this.callOpenAi(payload, sender, source, headers);
        }
      }

      if (!responseData || !responseData.length) {
        throw new Error("no data returned from response server");
      }

      return source !== "web" ? responseData : responseData.map((data) => this.responseData(data));
    } catch (err) {
      console.log(`Error in GET INTENT REQUEST (Attempt ${retryCount + 1} of ${maxRetries}) =>`, err);
      retryCount++;

    }
    // }

    console.log(`Max retries (${maxRetries}) reached. Unable to get a successful response.`);
    return ['web', process.env.ANOTHER_HOST_DOMAIN].includes(source) ? this.responseServerDown : rasaServerDown;
  }

  async callOpenAi(payload, sender, source, headers) {
    console.log(payload, "openaipayload>>>>>>")
      const url = this.baseUrl + `/webhooks/${sourceMap[source]}/webhook`;
      let baseRoute=payload?.type==='audio'?'palmmindaudio':'palmmind';
      if(source!='web' && payload.attachment){
         baseRoute=payload?.attachment?.type ==='audio'?'palmmindaudio':'palmmind';
         payload= payload.attachment.payload

      }
    
      if(payload?.type==='audio'){
        payload= payload.payload
      }
      console.log(payload, "after>>>>>")
    // let openAi = `${process.env.OpenUrl}/${baseRoute}/?query=${payload}&sender=${sender}&source=${source}&url=${url}`;
    let llmUrl = new URL(`${process.env.OpenUrl}/${baseRoute}`)
    let searchParams = new URLSearchParams();
    searchParams.append(`query`, `${(payload) }`)
    searchParams.append(`sender`, `${sender}`)
    searchParams.append(`source`, `${source}`)
    searchParams.append(`url`, `${url}`)
    llmUrl.search= searchParams.toString();
    console.log(llmUrl.toString(), ">>>>>>>>>>>>llm")

    const response = await ServerServices.getFromServer(llmUrl.toString(), headers);
   
    // console.log("app.js 378",await response.text())

    let responseData = await response.json();
    console.log(responseData,"response")
    if (Array.isArray(responseData.Answer)) {
      let result = responseData.Answer.map(em => {
        return {
          ...em, translated: responseData.translated
        }
      })
      console.log(result)
      responseData = result;
    } else {
      responseData = [
        {
          responseFrom: "openAI",
          ...responseData
        }
       
      ]
      responseData.Answer && responseData.Answer.text ?responseData['text']=responseData.Answer.text : responseData.Answer || responseData.text
    }
    return responseData
  }

  responseData(data) {
        if (data.hasOwnProperty("text") && data.hasOwnProperty("buttons")) {
      const quickReplies = {
        title: data.text,
        type: "quick_reply",
        data: data.buttons,
        prevUtter: this.previousUtter,
      };

      return {
        responseMessage: quickReplies,
        message: data.text,
        responseFrom: data.responseFrom || "rasa"
      };
    }
    // if (data.hasOwnProperty("text") && !data.hasOwnProperty("buttons")) {
    //   let response = { message: data.text, responseFrom: data.responseFrom || "rasa" };
    //   if (data.text.length < 50) {
    //     response["responseMessage"] = { message: data.text, prevUtter: false, responseFrom: data.responseFrom || "rasa" };
    //   } else {
    //     response["responseMessage"] = { message: data.text, responseFrom: data.responseFrom || "rasa" };
    //   }

    //   return response;
    // }
    if (data.hasOwnProperty("custom")) {
      let custom = data.custom;
      if (custom.hasOwnProperty('isform') || custom.hasOwnProperty('is_form')) {
        if (custom.hasOwnProperty('text') || custom.hasOwnProperty('message')) {
          console.log("inside unhandled query")
          return {
            responseMessage: {
              message: custom.text || custom.message,
              isform: true
            },
            responseFrom: data.responseFrom || "rasa",
            visitorData: data.custom.user_details,
            message: custom.hasOwnProperty('text') ? custom.text : '',
            isform: true
          }
        } else {
          let mappingData = { ...custom, previousUtter: this.previousUtter };

          let res = {
            responseMessage: mappingData,
            visitorData: data.custom.user_details,
            responseFrom: data.responseFrom || "rasa",
            message: data.custom.hasOwnProperty("title") ? data.custom.title : "",
          }
          if (custom.hasOwnProperty('is_form') || custom.hasOwnProperty('isform')) {
            res = { ...res, isform: true }
          }
          return res;
        }

      }
      let mappingData = { ...custom, previousUtter: this.previousUtter };
      return {
        responseMessage: mappingData,
        message: data.custom.hasOwnProperty("title") ? data.custom.title : "",
        visitorData: data.custom.user_details,
        responseFrom: data.responseFrom || "rasa"

      };
    }
  }

}

module.exports = new RasaAPI({
  host: process.env.RASA_HOST || "15.206.233.76",
  port: process.env.RASA_PORT || "5005",
  protocol: process.env.SOCKET_PROTOCOL || "http",
});
