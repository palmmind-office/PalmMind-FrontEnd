const catchAsync = require("../utils/catchAsync");
const fetch = require('node-fetch');

// Corrected the URL format
const baseUrl = process.env.CalendarUrl;
const apiId = process.env.ApiId;
const calendarName = process.env.CalendarName;

exports.editCalendarEvent = catchAsync(async (req, res, next) => {
  const {
    droper,
    fullName,
    companyName,
    designation,
    mobileNumber,
    emailAddress
  } = req.body;
  
  try {
    const response = await fetch(`${baseUrl}/events/${droper}?id=${apiId}&calendar=${calendarName}`, 
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          "summary": `Demo meeting: ${fullName}`,
          "meetLink": true,
          "description": `Demo meet with ${fullName}: ${designation} of ${companyName}. Contact: ${mobileNumber}`,
          "attendees": [`${emailAddress}`],
        }
      ),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    res.send(result);

  } catch (error) {
    console.error("Error creating calendar event:", error);
    return false;
  }
});
