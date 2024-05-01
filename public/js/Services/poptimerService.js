import { env } from "../../env";
import { popUp } from "../Module/popupModule";
import { socketModule } from "../core/socket";
import { sessionstorage } from "../general/sessionstorage";

export var timerPopUp = {
  Timer() {
    let stepToPop = env.stepToPopUp;
    let username = localStorage.getItem('userName')
    // let sessionStorageItems = sessionstorage.get('previousMessage') || 'default,'

    // let sessionStorageCount = (sessionStorageItems.match(/!/g) || []).length;
    // sessionStorageCount = sessionStorageCount + 1
    // // console.log(sessionStorageCount)
    // if (sessionStorageCount % stepToPop === 0) {
    // //  showModel();
    // }

    function showModel() {
      if (!username) {
        socketModule.messageSend("scholorship")
        let formData = {}
        formData.title = "We might loose you, would you like to provide your info ?"
        formData.name = "FullName"
        formData.mobile = "Mobile Number"
        console.log("formData:", formData);
        popUp.popUpMessage(formData);
      }
    }
  }
}