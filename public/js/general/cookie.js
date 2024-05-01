/**
 * Cookie Module for all functionality for cookie.
 */
import {env} from "../../env"
export var cookie = {
    init: function(){

    },
    getCookie: function(key){
        let cookies = document.cookie.split(';');        
        let cookie = cookies.find((data)=>data.includes(`${key}=`));        
        if(cookie){
            return cookie.split('=')[1];
        }
        else{
            return null;
        }
    },
    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {*} expireTime in {
     * month: value,
     * days: value,
     * hours: value,
     * minutes: value,
     * seconds: value
     * }
     */
    setCookie: function(key, value, expireTime){        
        let time = this.getTime(expireTime);
        document.cookie =env.protocol==='https'?`${key}=${value};SameSite=None; Secure;expires=${time.toUTCString()}`:`${key}=${value};expires=${time.toUTCString()}`;
        document.cookie = "expires=" + time.toUTCString() + ';';
    },
    /**
     * returns time ahead of the current time by the specified parameters mentioned in expireTime.
     * @param {} expireTime 
     */
    getTime: function(expireTime){
        let now = new Date();        
        if(typeof(expireTime) == 'object' && expireTime !== null){
            Object.keys(expireTime).forEach(key => {
                if(expireTime.hasOwnProperty(key)){
                    if(key === 'month'){
                        now.setMonth(now.getMonth() + parseFloat(expireTime[key]));
                    }
                    if(key === 'days'){
                        now.setDate(now.getDate() + parseFloat(expireTime[key]));
                    }
                    if(key === 'hours'){
                        now.setHours(now.getHours() + parseFloat(expireTime[key]));
                    }
                    if(key === 'minutes'){
                        now.setMinutes(now.getMinutes() + parseFloat(expireTime[key]));
                    }
                    if(key === 'seconds'){
                        now.setSeconds(now.getSeconds() + parseFloat(expireTime[key]));
                    }
                }
            })
        }
        return now;
    },
    isCookieExists: function(key){
        return document.cookie.includes(`${key}=`);
    },
    deleteCookie: function(){

    }
}