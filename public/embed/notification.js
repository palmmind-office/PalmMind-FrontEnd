import {Howl} from 'howler';
import { env } from '../env';
let SoundUrl=env.protocol=='https'? `${env.protocol}://${env.server}`:`${env.protocol}://${env.server}:${env.port}`;
export let playSound=(type)=>{
    console.log(SoundUrl,"sound url")
    if(type==='send'){
        Sound = new Howl({
            src: [`${SoundUrl}/NotifyTransfer.mp3`]
          });
    }
    if(type==='get'){
       Sound = new Howl({
        src: [`${SoundUrl}/NotifyTransfer.mp3`]
          }); 
    }
      Sound.play();
}

export let isDisabled={
    disabled:false,
    init:function(value){
        this.disabled=value;
        this.isDisabledBot()
    },
    isDisabledBot:function(){
         if(this.disabled){
            setTimeout(()=>{
                this.disabled=false
            },5000)
         }
    }
}