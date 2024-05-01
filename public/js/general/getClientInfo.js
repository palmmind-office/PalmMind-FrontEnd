import { env } from '../../env';

let client = new ClientJS();

let locationNameWithLatLon = async (longitude, latitude) => {
  let location = null
  try {
    let mapBoxUrl = `${env.baseUrlMapBox}/${longitude},${latitude}.json?access_token=${env.access_token}`;
    let clientDetails = await fetch(mapBoxUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    clientDetails = await clientDetails.json();
    if (clientDetails && clientDetails.features.length > 0) {
      location = clientDetails.features[0].place_name
    }
  } catch (error) {
    console.log(error, "from get location");
  } finally {
    return location
  }

}


export let getDeviceInfo = ()=>{
  return new Promise( (resolved,reject) => {
    let deviceInfo = {};
    deviceInfo['browserName'] = client.getBrowser() || "Unknown Browser";
    deviceInfo['browserVersion'] = client.getBrowserVersion() || "Unknown Version";
    deviceInfo['browserInfo'] = `${client.getBrowser()}, ${deviceInfo['browserVersion']}`;
    deviceInfo['osName'] = client.getOS() || "Unknown OS";
    deviceInfo['osVersion'] = client.getOSVersion() || "Unknown Version";
    deviceInfo['osInfo'] = `${client.getOS()}, ${deviceInfo['osVersion']}`;
    deviceInfo['deviceName'] = client.getDevice() || "Unknown Device";
    deviceInfo['deviceType'] = client.getDeviceType() || "Unknown Type";
    //get latitud and longitude
    if (navigator && navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 3600000
      };
      navigator.geolocation.getCurrentPosition(async (position) => {
        deviceInfo['latitude'] = position.coords.latitude;
        deviceInfo['longitude'] = position.coords.longitude;
        deviceInfo['location'] = await locationNameWithLatLon(position.coords.longitude, position.coords.latitude);
        resolved(deviceInfo)
      }, (err) => {
        resolved(deviceInfo)
      },options);
    }
    else {
      resolved(deviceInfo)
    }
   
  })
} 



export let getClientIpAddress = async () => {
  try {
    const url = `https://jsonip.com/`;
    // const url=`http://localhost:9001/clientIp`
    const response = await fetch(url, {
      method: "GET"
    })
    const data = await response.json();
    console.log(data)
    return data

  } catch (error) {
    return null
  }
};

