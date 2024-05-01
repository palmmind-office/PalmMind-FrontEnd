/**
 * Includes all the functionalities for google analytics.
 */
import {env} from "../../env"
import { cookie } from "./cookie";

export var googleAnalytics = {
    /**
     * @param {*} obj should be an object of following fields
     * hitType, eventCategory, eventAction, eventLabel.
     * ga stands for google analytics.
     */
    recordEvent: function(obj){
        console.log(obj, "--------google analaytics obj---------")
        // ga('send', {
        //     hitType: obj.hitType || 'event',
        //     eventCategory: obj.eventCategory || 'bot',
        //     eventAction: obj.eventAction || null,
        //     eventLabel: obj.eventLabel || null
        // });
        window.parent.postMessage({
            type: 'googleAnalitics',
            data: obj
        }, env.parentUrl);

        let visitorId = cookie.getCookie('webUniqueID') || cookie.getCookie('uniqueID');

        //old
        gtag('event', `${obj.eventCategory}`, {
            "send_to": 'palmMindOld',
            'event_category': obj.eventCategory || 'bot',
            'event_label': obj.eventLabel || "null",
            'event_action': obj.eventAction || "null",
            "event_origin": "bot",
            "visitor_id": visitorId || "none",
        })


        gtag('event', `${obj.eventCategory}`, {
            "send_to": 'palmMindNew',
            'event_category': obj.eventCategory || 'bot',
            'event_label': obj.eventLabel || "null",
            'event_action': obj.eventAction || "null",
            "event_origin": "bot",
            "visitor_id": visitorId || "none",
            'newService': 'yes'
        })
        // gtag('event', `${obj.eventAction.title || obj.eventAction || "default_event"}`, {
        //     'event_category': obj.eventCategory || 'bot',
        //     'event_label': obj.eventLabel || null,
        //     'event_action': obj.eventAction.title || obj.eventAction || null
        // });
    },
    recordUrl: function(obj) {
        // get Cookie
        let visitorId = cookie.getCookie('webUniqueID') || cookie.getCookie('uniqueID');
        
        gtag('event', `web_link`, {
            'event_label': obj.eventLabel || "LinkChange",
            'event_action': obj.eventAction || "Click",
            'visitor_id': visitorId || "none",
            'web_link': obj.web_link || "hidden",
            'send_to': 'palmmind'
        });
    }
}