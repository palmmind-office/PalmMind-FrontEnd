let localrundata = {
  startMessaging: {
    type: "quick_reply",
    title: "Greetings ! from PalmMind Technology. I'm PalmBot, Your AI Assistant. How may I help you today?",
    data: []
  },
  menu: {
    type: "quick_reply",
    title: "Greetings ! from PalmMind Technology. I'm PalmBot, Your AI Assistant. How may I help you today?",
    data: [
      {
        title: "Book a Demo",
        payload: "Book a Demo",
      },
      {
        title: "Get a free Trial",
        payload: "Get a free Trial",
      },
      {
        title: "See our Chatbots",
        payload: "See our Chatbots",
      },
      {
        title: "Jobs",
        payload: "Jobs",
      },
      {
        title: "Talk to Live Agent",
        payload: "livechat:request:all",
      },

    ]
  },

  contact: {
    title: `To contact us or visit our location, you can reach out to us through the following means:</br></br>
    <b>Location:</b>
    Banasthali-16, Kathmandu, Nepal</br></br>
    <b>Contact Details:</b>
    Email: info@palmmind.com</br>
    Phone: +977-01-5912155</br>
    Mobile: +977-9851201865</br></br>
    Feel free to reach out to us via email or phone call during our business hours. If you prefer to visit us in person, our address in Banasthali-16, Kathmandu, Nepal, is where you can find us. We look forward to assisting you with any inquiries or services you may require.`,
    type: "quick_reply",
    data:[]
  },

  ourProducts:{
    title:"We have wide range of services/ chatbot products available for our customers:",
    type:"quick_reply",
    data:[
      {
        title:"Banking",
        payload:"Banking"
      },
      {
        title:"Insurance",
        payload:"Insurance"
      },
      {
        title:"Automotive",
        payload:"Automotive"
      },
      {
        title:"Government",
        payload:"Government"
      },
      {
        title:"Colleges",
        payload:"Colleges"
      },
      {
        title:"Education Consultancies",
        payload:"Education Consultancies"
      },
    ]
  },
  banking:{
    title:"Great Choice, Our Banking Chatbot facilitate fully/partially automate customer-facing financial transactions and banking services, restricting the need for human interventions.<br /> Some of the use cases that an banking chatbot comprise:",
    type:"ListItem",
    subtitle:"Use Cases",
    data:[
      {
        subtitle:"● Avail services"
      },
      {
        subtitle:"● Automate support"
      },
      {
        subtitle:"● Provide location-based services"
      },
      {
        subtitle:"● Personal banking assistance"
      },
      {
        subtitle:"● Engage customers"
      },
      {
        subtitle:"● Provide insights"
      },
      {
        subtitle:"● Collect customer feedback"
      },
    ],
    button: [
      {
      title: "Know More",
      payload: "Know More",
    }
    ]
  },
  insurance:{
    title:"Great Choice, Our Insurance Chatbot are designed to answer queries, assist in selecting the right insurance plans, and even help with filing claims—all in real-time.<br /> Some of the use cases that an insurance chatbot comprise:",
    type:"ListItem",
    subtitle:"Use Cases",
    data:[
      {
        subtitle:"● Tailored insurance plans through intelligent chatbot questioning"
      },
      {
        subtitle:"● Accelerated chatbot-driven claims processing"
      },
      {
        subtitle:"● Instant access to policy details via chatbot"
      },
      {
        subtitle:"● Seamless chatbot payment management"
      },
      {
        subtitle:"● Real-time customer feedback through chatbot interactions."
      },
    ],
    button: [
      {
      title: "Know More",
      payload: "Know More",
    }
    ]
  },
  automotive:{
    title:"Great Choice, Our Automotive Chatbot are designed to facilitate customers with enhanced buy experiences and most of all to study a lot about the company, the vehicle, its features all in real-time.<br /> Some of the use cases that an automotive chatbot comprise:",
    type:"ListItem",
    subtitle:"Use Cases",
    data:[
      {
        subtitle:"● Capturing new leads and nurturing existing"
      },
      {
        subtitle:"● Attending customers and answering their questions"
      },
      {
        subtitle:"● Scheduling test drives"
      },
      {
        subtitle:"● Offering purchase assistance"
      },
      {
        subtitle:"● Delivering after-sales services"
      },
      {
        subtitle:"● Gathering customer feedback"
      },
      {
        subtitle:"● Tracking customer data"
      },
    ],
    button: [
      {
      title: "Know More",
      payload: "Know More",
    }
    ]
  },
  colleges:{
    title:"Great Choice, Our College/ Educational Institution Chatbot are designed to transform the way schools interact with students alongside exploring all kinds of activities related to our studies.<br /> Some of the use cases that an educational institution chatbot comprise:",
    type:"ListItem",
    subtitle:"Use Cases",
    data:[
      {
        subtitle:"● Better student engagement"
      },
      {
        subtitle:"● Course registration and enrollment queries"
      },
      {
        subtitle:"● Proactive student support"
      },
      {
        subtitle:"● Career guidance and job placement"
      },
      {
        subtitle:"● Teacher's assistant and administrative support"
      },
      {
        subtitle:"● Feedback collection and data repository"
      },
    ],
    button: [
      {
      title: "Know More",
      payload: "Know More",
    }
    ]
  },
  consultancy:{
    title:"Great Choice, Our Education Consultancies Chatbot are designed to transform the pathway or career guidance for better expose of student abroad, counselling them about schools interact with students alongside exploring all kinds of activities related to our studies.<br /> Some of the use cases that an educational consultancy chatbot comprise:",
    type:"ListItem",
    subtitle:"Use Cases",
    data:[
      {
        subtitle:"● Better student counselling"
      },
      {
        subtitle:"● Course registration and enrollment queries"
      },
      {
        subtitle:"● Proactive student support"
      },
      {
        subtitle:"● Career guidance/ Abroad Opportunity Assistance"
      },
      {
        subtitle:"● Support on Visa, Abroad Study and International Institutions related queries"
      },
      {
        subtitle:"● Feedback collection"
      },
    ],
    button: [
      {
      title: "Know More",
      payload: "Know More",
    }
    ]
  },
  government:{
    title:"Great Choice, Our Government Chatbot are designed to improve the experience that people have when working with government bodies which help citizens and visitors get access to the right information and services.<br /> Some of the use cases that an government chatbot comprise:",
    type:"ListItem",
    subtitle:"Use Cases",
    data:[
      {
        subtitle:"● Respective answers regarding government queries"
      },
      {
        subtitle:"● Different respective government services like complaint registration, protocols to follow, departmental inquiry -all in real time to reduce effort and time"
      },
      {
        subtitle:"● Citizen / Visitors Feedback"
      },
    ],
    button: [
      {
      title: "Know More",
      payload: "Know More",
    }
    ]
  },

  knowMore:{
    title: "Would you like to schedule a quick demo of our Chatbot?",
    type:"quick_reply",
    data:[
      {
        title:"Book a Demo",
        payload:"Book a Demo",
      },
      {
        title:"Menu",
        payload:"Menu",
      },
    ]
  },

  bookDemo: {
    title: "Kindly provide your details to schedule a Chatbot demo with us.",
    type: "form",
    successResponse: ["Your request for booking a demo has been fulfilled. We will contact you shortly."],
    action: "rest/v1/user/userInterest",
    formType: "Schedule Chatbot Demo",
    data: [
      {
        "label": "Company Name",
        "placeholder": "Enter company name",
        "id": "companyName",
        "type": "text",
        "validation": {
          "required": true,
          "companyname": true
        }
      },
      {
        "label": "Contact Person",
        "placeholder": "Enter the contact details",
        "id": "fullName",
        "type": "text",
        "validation": {
          "required": true,
          "fullname": true
        }
      },
      {
        "label": "Designation",
        "placeholder": "Enter your designation at the company",
        "id": "designation",
        "type": "text",
        "validation": {
          "required": true,
          "designation": true
        }
      },
      {
        "label": "Mobile Number",
        "placeholder": "Enter mobile number",
        "id": "mobileNumber",
        "type": "number",
        "validation": {
          "required": true,
          "mobile": true
        }
      },
      {
        "label": "Email Address (Optional)",
        "placeholder": "Enter email address",
        "id": "emailAddress",
        "type": "email",
        "validation": {
          "required": false,
          "email": true
        }
      },
      
    ],
    buttons: {
      data: [
        {
          "text": "Cancel",
          "type": "cancel"
        },
        {
          "text": "Submit",
          "type": "submit"
        }
      ]
    }
  },
  getFreeTrial: {
    title: "You could take our chatbot on Trial for two weeks before you purchase. Kindly provide your details for the same.",
    type: "quick_reply",
    data:[{
      "title":"Provide your details",
      "payload":"Get Free Trial Form"
    }]
  },
  getFreeTrialForm: {
    title: "Kindly provide your details to get Chatbot on Trial.",
    type: "form",
    successResponse: ["Your request for geting the chatbot on trial has been submitted. We will contact you shortly."],
    action: "rest/v1/user/userInterest",
    formType: "Get Free Trial",
    data: [
      {
        "label": "Company Name",
        "placeholder": "Enter company name",
        "id": "companyName",
        "type": "text",
        "validation": {
          "required": true,
          "companyname": true
        }
      },
      {
        "label": "Contact Person",
        "placeholder": "Enter the contact details",
        "id": "fullName",
        "type": "text",
        "validation": {
          "required": true,
          "fullname": true
        }
      },
      {
        "label": "Designation",
        "placeholder": "Enter your designation at the company",
        "id": "designation",
        "type": "text",
        "validation": {
          "required": true,
          "designation": true
        }
      },
      {
        "label": "Mobile Number",
        "placeholder": "Enter mobile number",
        "id": "mobileNumber",
        "type": "number",
        "validation": {
          "required": true,
          "mobile": true
        }
      },
      {
        "label": "Email Address (Optional)",
        "placeholder": "Enter email address",
        "id": "emailAddress",
        "type": "email",
        "validation": {
          "required": false,
          "email": true
        }
      },
      
    ],
    buttons: {
      data: [
        {
          "text": "Cancel",
          "type": "cancel"
        },
        {
          "text": "Submit",
          "type": "submit"
        }
      ]
    }
  },
  lookJob: {
    title: "We offer variety of positions here at PalmMind. Please choose your choice of interest.",
    type:"quick_reply",
    data:[
      {
        title:"Full Time Job",
        payload:"Full Time Job"
      },
      {
        title:"Internship",
        payload:"Internship"
      },
    ]
  }, 
  fullTimeJob: {
    title: "We offer multiple Full Time positions. Please select your preferred position:",
    type:"quick_reply",
    fulltimePosition: true,
    data:[
      {
        title:"MEAN/MERN STACK Developer",
        payload:"Apply for Position"
      },
      {
        title:"AI/ML Engineer",
        payload:"Apply for Position"
      },
      {
        title:"QA Engineer",
        payload:"Apply for Position"
      },
      {
        title:"Digital Marketing Manager",
        payload:"Apply for Position"
      },
    ]
  },
  internship: {
    title: "We have various internship available. Please select your preferred position:",
    type:"quick_reply",
    internPosition: true,
    data:[
      {
        title:"MEAN/MERN Intern",
        payload:"Apply for Position"
      },
      {
        title:"AI/ML Engineer Intern",
        payload:"Apply for Position"
      },
      {
        title:"QA Engineer Intern",
        payload:"Apply for Position"
      },
      {
        title:"Digital Marketing Intern",
        payload:"Apply for Position"
      },
      {
        title:"Research & Development Intern",
        payload:"Apply for Position"
      },
      {
        title:"Marketing Intern",
        payload:"Apply for Position"
      },
      
    ]
  },
  applyJob:{
    title:"You can apply for the position using online form clicking the apply now option below or Kindly send us your resume at: <br/><b>info@palmmind.com</b> ",
    type:"quick_reply",
    data:[
      {
        title:"Apply Now",
        payload:"Apply Now"
      }
    ]
  },
  applyNow: {
    title: "Kindly fill up your details and drop your resume to apply for the position.",
    subtype:"Job Application",
    type: "form",
    formType: "Job Application",
    successResponse: "You have successfully applied for the position. We will contact you shortly.",
    action: "rest/v1/uploadDocs",
    for:"Job Application",
    multipart: true,
    data: [
      
      {
        "label": "Full Name",
        "placeholder": "Enter your full name",
        "id": "fullName",
        "type": "text",
        "validation": {
          "required": true,
          "fullname": true
        }
      },
      {
        "label": "Email Address",
        "placeholder": "Enter email address",
        "id": "emailAddress",
        "type": "email",
        "validation": {
          "required": true,
          "email": true
        }
      },
      {
        "label": "Mobile Number",
        "placeholder": "Enter mobile number",
        "id": "mobileNumber",
        "type": "number",
        "validation": {
          "required": true,
          "mobile": true
        }
      },
      {
        "label": "Upload Resume",
        "placeholder": "Upload your resume here",
        "id": "resume",
        "type": "file",
        "validation": {
          "required": true,
          "resume": true
        }
      },  
    ],
    buttons: {
      data: [
        {
          "text": "Cancel",
          "type": "cancel"
        },
        {
          "text": "Submit",
          "type": "submit"
        }
      ]
    }
  },
  complaint: {
    "type": "form",
    "subtype": "report_issue",
    "formType": "complaint",
    "Back": {
      "title": "Feedback and Complain",
      "payload": "Complain"
    },
    "action": "rest/v1/complaint/",
    "title": "Report your problem.",
    "data": [
      {
        "label": "Full name",
        "placeholder": "Enter full name",
        "id": "fullName",
        "type": "text",
        "validation": {
          "required": false,
          "fullname": true
        }
      },
      {
        "label": "Email Address",
        "placeholder": "Enter email address",
        "id": "emailAddress",
        "type": "email",
        "validation": {
          "required": false,
          "email": true
        }
      },
      {
        "label": "Mobile Number",
        "placeholder": "Enter mobile number",
        "id": "mobileNumber",
        "type": "number",
        "validation": {
          "required": false,
          "mobile": true
        }
      },
      {
        "label": "Problem",
        "placeholder": "Enter your Problem here....",
        "id": "problem",
        "type": "textarea",
        "validation": {
          "required": false,
          "problem": true
        }
      }
    ],
    "buttons": {
      "data": [
        {
          "text": "Cancel",
          "type": "cancel"
        },
        {
          "text": "Submit",
          "type": "submit"
        }
      ]
    }
  },

}
module.exports = localrundata;
