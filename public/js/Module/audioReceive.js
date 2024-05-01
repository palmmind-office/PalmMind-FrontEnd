

import { env } from "../../env";
export let  audioReceive ={
 
    init: function (data) {
      this.data = data;
      console.log(this.data,'entry>>>')
        this.cacheDOM();
        this.render();
    
      },
      cacheDOM: function () {
        this.$message = $("#message-module");
        this.$parentElem = this.$message.find(".message-section").find("ul");
      },
      scrollBottom: function () {
        $(".messages").animate(
          {
            scrollTop: $("#message-module")[0].scrollHeight,
          },
          "fast"
        );
      },
      
      render: function(){
        if(this.data.hasOwnProperty("text")){

          if (this.$parentElem.find('audio').length > 0) {
            let previousAudios = this.$parentElem.find('audio');
            let previousAudio = previousAudios[previousAudios.length-1];
            console.log(previousAudio, "prevaudio>>>>")
            previousAudio.pause();
          }
                
                let node = $(`<li class="sent"><img id="sentImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="position: relative;
                top: 6px;" >${this.data.text}<audio autoplay controls src="${this.data.path}" style="width: 100%; margin: unset; border-radius: 22px;"></audio></p></li>`);
                node.appendTo(this.$parentElem);
                       
        }
      
        this.scrollBottom();
      }
}