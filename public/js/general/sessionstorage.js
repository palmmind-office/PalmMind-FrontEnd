let sessionstorage={
    /*
    * @param {string} key
    * @param {string} value
    */
    SESSION : {},
    set:function(key='',value=null){
        // sessionStorage.setItem(key,value); 
        this.SESSION[key]=value;
    },
    /*
    * @param {string} key
    * @return {string} value
    */
    get:function(key=''){
        return this.SESSION[key];
    },

    removeItem:function(key=''){
        delete this.SESSION[key];
    },

    concateMessage:function(key, message=''){
        let previousUtterance=this.get(key);
        if(previousUtterance){
            if(typeof message==='object'){
                previousUtterance=previousUtterance+'!'+message.payload;
            }else{
                previousUtterance=previousUtterance+'!'+message;
            }
        }else{
            if(typeof message==='object'){
                previousUtterance=message.payload;
            }else{
                previousUtterance=message;
            }
        }
        this.set(key,previousUtterance);
    },

    findPreviousMessage:function(key){
        let previousUtterance=this.get(key);
        let parseMessage=previousUtterance.split('!');
        parseMessage.pop();
        let payload={
            title:'Previous',
            payload:parseMessage[parseMessage.length-1]
        }
        this.set(key,parseMessage.join('!'));
        return payload;
    },

    clear:function(key){
        this.removeItem(key);
    }
}
export {sessionstorage};
