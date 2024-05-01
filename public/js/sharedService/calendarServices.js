const editCalendarEvent = async (eventData, url) => {
  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    })
    const result = await response.json();
    // console.log(result);
  }catch(error){
    console.error("error fetching data " + error);
  }
  
}

module.exports = { editCalendarEvent }