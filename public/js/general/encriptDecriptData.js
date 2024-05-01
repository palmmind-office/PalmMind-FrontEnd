function encryptData(data) {
    return btoa(data);
  }
  
  function decryptData(encryptedData) {
    return atob(encryptedData);
  }

  export {
    encryptData,
    decryptData
  }