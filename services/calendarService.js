const fetch = require('node-fetch');
// Corrected the URL format
const baseUrl = process.env.CalendarUrl;
const apiId = process.env.ApiId;
const calendarName = process.env.CalendarName;

//helper function
const getDuration = (startTimeString, endTimeString) => {
  const options = { hour: 'numeric', minute: 'numeric' };
  const startTime = new Date(startTimeString);
  const endTime = new Date(endTimeString);

  const startTimeFormatted = startTime.toLocaleString('en-US', options);
  const endTimeFormatted = endTime.toLocaleString('en-US', options);

  const startDate = startTime.toLocaleString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });

  const result = `${startTimeFormatted} - ${endTimeFormatted}: ${startDate}`;
  return (result);
}

//helper function
const getCalendar = async () => {
  try{
    const allEvents = await fetchCalendarEvents();
    const slots = [
      {for: 'default', id: 'default', name: 'Select Slot'}
    ]
    allEvents.data.forEach(event => {
      const { start, end, id, attendees } = event;
      if(!attendees){
        const duration = getDuration(start.dateTime, end.dateTime)
        slots.push({ 
          name:`${duration}`, 
          id,
          for: id,
        })
      }
    });

    const bookDemo = {
      title: "Kindly provide your details to schedule a Chatbot demo with us.",
      type: "form",
      successResponse: ["Your request for booking a demo has been fulfilled. We will contact you shortly."],
      action: "rest/v1/user/userInterest",
      calendar: true,
      calednarUrl: "rest/v1/calendar",
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
            type: "dropdown",
            placeholder: "Available Slots",
            label: "Schedule Demo",
            id: "droper",
            validation: {
              required: false,
              droper: true,
            },
            description:
              "Choose from the available slots",
            data: slots
          }
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
    }
    return bookDemo
  }catch(err){
    console.error("Error in calendar event creation", err);
    return false
  }
}

//Api requests

const fetchCalendarEvents = async () => {
  const response = await fetch(`${baseUrl}/events/?id=${apiId}&calendar=${calendarName}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result
}

/*
const createCalendarEvent = async (eventData) => {
  let startTime = eventData.demoDate;
  const millisecondsSinceEpoch = Date.parse(startTime);
  const formattedTime = millisecondsSinceEpoch.toString();
  try {
    const response = await fetch(`${baseUrl}/events?id=${apiId}&calendar=${calendarName}`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          "startTime": formattedTime,
          "duration": eventData.duration,
          "summary": `Demo meeting with ${eventData.fullName}`,
          "meetLink": true,
          "description": `Company name: ${eventData.companyName}`,
          "attendees": [`${eventData.emailAddress}`, `${eventData.emailAddress2}`],
          "reminders": {
              "useDefault": false,
              "overrides": [
                  { "method": "email", "minutes": 30 },
                  { "method": "popup", "minutes": 10 }
              ]
          },
          "location": "Banasthali"
        }
      ),
    });

    const result = await response.json();    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return result || false;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return false;
  }
};
*/

module.exports = { getCalendar }