import {
  socketModule
} from "./socket";
export const SpeechRecognitionrun = {
  message: ``,
  init: function () {

    if ('speechSynthesis' in window) {
      console.log('Speech recognition supported 😊');
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      console.log(SpeechRecognition, "data");
      var recognition = new SpeechRecognition();
      recognition.onstart = function () {
        $('#getSpeech').removeClass('fa-microphone-slash');
        $('#getSpeech').addClass("startingmicro fa-microphone");
        console.log("started");
      };

      recognition.onspeechend = function () {
        $('#getSpeech').addClass('fa-microphone-slash');
        $('#getSpeech').removeClass("startingmicro fa-microphone");
        console.log("Stop recognizating text");
        recognition.stop();
      }

      recognition.onresult = async function (event) {
        var transcript = event.results[0][0].transcript;
        $('#search1').val(transcript);
        setTimeout(() => {
          $('#getSpeech').addClass('fa-microphone-slash');
          $('#getSpeech').removeClass("startingmicro fa-microphone");
          this.checkconnection(transcript);
          //  this.readSpeechMsg(transcript);
        }, 1000);

        $('#result').html('');
        $('#context img').attr("src", "images/embed/cross.png");
      }.bind(this);
      recognition.start();
    } else {
      console.log('Speech recognition not supported 😢');
    }
  },
  checkconnection: function (message) {
    $("#errorinputtext").css("display", "none !important");
    var status = navigator.onLine;
    if (status) {
      $('#context img').attr('src', 'images/embed/cross.png');
      var numbers = /^[ -'-.-?-?-@-A-Za-z0-9]+?[^#<+*<>{}()|\n\r]+$/;
      if (message == '') {
        return false
      }
      if (message.match(numbers)) {
        socketModule.messageSend(message);
        this.message = '';
        document.getElementById("errorinputtext").style.display = "none";
      }
      if (!message.match(numbers)) {
        document.getElementById("errorinputtext").style.display = "inline";
      }
      if (message === "human") {
        socketModule.joinRoom();
      }
    } else {
      $.notify(env.internetConnection, "warn");
      LoadingModule.clear();
    }
  },
  readSpeechMsg: function (message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = message;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);

  }
}

// let btn=$(".btn");
// btn.click(function(){

// })