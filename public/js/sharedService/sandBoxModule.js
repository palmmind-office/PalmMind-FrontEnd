import { Detaildrawer } from "../DetailsDrawer/detailDrawerModule";
import { multipleTitle } from "../general/multipleTitleModule";
import { quickReplyModule } from "../Module/quickReplyModule";
import { contactmodule } from "../Module/contact.Module";
import { formSupportModule } from "../Module/formSupportModule";
import { liveChatRequestPopup } from "../general/liveChatRequestPopup";
import { introModule } from "../Module/introductionModule";
import { ListItemModule } from "../Module/ListItemModule";

class SandBox {
  constructor() {
    // console.log("sandbox module initialized");
  }

  showModules() {
    // ----->>>> here we can show modules <<<<<<<<<<<-------------
  }
  clearAllModules() {
    // ----->>>> here we can clear all modules <<<<<<<<<<<-------------
    quickReplyModule.clear();
    introModule.clear();
    ListItemModule.clear()
    multipleTitle.clear();
    Detaildrawer.clear()
    contactmodule.clear()
    formSupportModule.clear();
    liveChatRequestPopup.clear();
  }
}

export var sandBox = new SandBox();