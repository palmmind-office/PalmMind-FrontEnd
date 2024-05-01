/**
 * All the services for localStorage
 * source :- https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/
 */

export var LocalStorage = {
    keyList: [],
    /**
     * Create new localstorage item or append to existing.
     * @param {*} key 
     * @param {*} value
     */
    setItem: function (key, val) {
        if (this.keyList.indexOf(key) < 0) {
            this.keyList.push(key);
        }

        let value = localStorage.getItem(key) || '';        
        if (value) {
            value = value.split(',');
            if(value.indexOf(val) < 0){
                value = value.join(',');
                value = value + ',' + val;
            }            
        }
        else {
            value = val;
        }
        localStorage.setItem(key, value);
    },
    /**
     * get Item of localstorage.
     * @param {*} key 
     */
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    /**
     * remove Item from local storage.
     * @param {*} key 
     */
    removeItem: function (key, val) {
        if (!val) {
            return localStorage.removeItem(key);
        }
        else {
            let allItems = localStorage.getItem(key);
            if (allItems) {
                allItems = allItems.split(',');
                if (allItems.length) {
                    let index = allItems.indexOf(val);
                    if (index > -1) {
                        allItems.splice(index, 1);
                    }
                    allItems = allItems.join(',');
                    if (allItems.length) {
                        localStorage.setItem(key, allItems);
                    }
                    else {
                        return localStorage.removeItem(key);
                    }
                }
            }
        }
    },
    /**
     * remove all the list of keys item.
     */
    clear: function () {
        this.keyList.forEach((key) => {
            localStorage.removeItem(key);
        });
    }
}