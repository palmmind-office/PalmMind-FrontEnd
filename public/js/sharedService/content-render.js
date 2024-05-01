import { quickReplyModule } from '../Module/quickReplyModule';
import { generalReplyModule } from '../Module/generalReplyModule';
import { fomrMessageModule } from '../Module/FormMessageModule';
import { Detaildrawer } from '../DetailsDrawer/detailDrawerModule';
import { contactmodule } from '../Module/contact.Module';
import { multipleTitle } from '../general/multipleTitleModule'
import { formSupportModule } from '../Module/formSupportModule';
import { env } from '../../env';
import { liveChatRequestPopup } from '../general/liveChatRequestPopup';
import { introModule } from '../Module/introductionModule'
import { locationModule } from '../Module/locationModule';
import { ListItemModule } from '../Module/ListItemModule';
import { audioReceive } from '../Module/audioReceive';

export function contentRender(data) {
  let type = data.type;

  switch (type) {

    case "quick_reply":
      quickReplyModule.init(data);
      break;
    case "audio":
        audioReceive.init(data);
        break;
    case "intro":
      introModule.init(data);
      break;
    case 'ListItem':
      ListItemModule.init(data);
      break;
    case 'location':
      locationModule.init(data);
      break;
    case "formMessageSection":
      fomrMessageModule.init(data);
      break;
    case "detailDrawer":
      Detaildrawer.init(data);
      break;

    case "contact":
      contactmodule.init(data);
      break;
    case "multiple-title":
      multipleTitle.init(data);
      break;
    case "form":
      formSupportModule.init(data);
      break;
    case "livechatIncomingRequest":
      window.parent.postMessage({
        type: type,
        isCount: true,
        data: data
      }, env.parentUrl);
      liveChatRequestPopup.init(data);
      $('#rememberVisitor').remove()
      break;
    default:
      window.parent.postMessage({
        type: type,
        isCount: true,
        data: data
      }, env.parentUrl);
      generalReplyModule.init(data);
  }

  // let inclideType=['quick_reply','location','contact','detailDrawer','ListItem','detailPolicy'];
  // if(inclideType.includes(type)){
  //     renderPreviousButton.init()
  // }
}
