import { Boot } from './js/core/boot';
import { env } from './env';

(function executeBot(){
    if(env.Node_env==='production'){
        console.log = function(){};
    }
    let url = window.location.search;
    let fullscreen = new URLSearchParams(url).get("fullscreen")
    
    if (fullscreen == 'true') {
        document.getElementsByTagName('head')[0].insertAdjacentHTML(
            'beforeend',
            '<link rel="stylesheet" href="./stylesheets/fullscreen.css" />');
    
    }
    
    let Boots = new Boot();
    Boots.initalisedOfChatbotModule();
    Boots.ChatbotBooter();
})()