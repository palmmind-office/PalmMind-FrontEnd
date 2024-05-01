const crypto = require("crypto");
const {env} = require("../../env");

const key = crypto
  .createHash('sha512')
  .update(env.encrypt.SECRECT_KEY)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(env.encrypt.SECRECT_IV)
  .digest('hex')
  .substring(0, 16)

exports.decryptData = function (encryptedData,isJson=true) {
  try {
    const decipher = crypto.createDecipheriv(env.encrypt.ALGORITHM, key, encryptionIV)
    
    let deprecatedString= decipher.update(encryptedData, 'hex', 'utf8') +
    decipher.final('utf8')
    isJson && (deprecatedString=  JSON.parse(deprecatedString))
    return deprecatedString
  } catch (error) {
    console.log("Error from crypto Decryption method: ", error); 
    return null;
  }
}

exports.encryptData =  function (data, isString=true) {
  try {
    const cipher = crypto.createCipheriv(env.encrypt.ALGORITHM, key, encryptionIV)
    isString && (data = JSON.stringify(data));
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  } catch (error) {
    console.log("Error from crypto Encryption method: ", error); 
    return null;
  }
}