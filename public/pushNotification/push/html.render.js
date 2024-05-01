import { env } from "../../env";
import { cookie } from "../../js/general/cookie";
import Axios from "axios";

export let renderHtml = {
  getVistor: async () => {
    let footer = ``;
    try {
      let visitorId = cookie.getCookie('uniqueID');
      let URL = `${env.protocol}://${env.server}:${env.port}${env.basePath}pushnotification/getVisitors/suscribed`

      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitor_id: visitorId
        })
      });
      let data = await res.json();
      if (data.data.is_register) {
        footer = `<footer class="footer">
                <button id="unblocked-cancel" class="align-right secondary popup-button">No Thanks</button>
                <button id="un-suscribe-notifications" class="align-right primary popup-button">Unsubscribe</button>
            </footer>`;
      } else {
        footer = `<footer class="footer">
              <button id="unblocked-cancel" class="align-right secondary popup-button">No Thanks</button>
              <button id="unblocked-allow" class="align-right primary popup-button">Subscribe</button>
          </footer>`;
      }
    } catch (error) {
      footer = `<footer class="footer">
                <button id="unblocked-cancel" class="align-right secondary popup-button">No Thanks</button>
                <button id="unblocked-allow" class="align-right primary popup-button">Subscribe</button>
             </footer>`;
    } finally {
      return footer
    }

  },

  allowPushNotifications: function (sectiondiv) {

    let contents = $(`
            <div class="text-center col-md-12 mt-3 col-sm-10 p-0">
                <div class="card-header p-0">
                    <img src="img/logo.png" alt="" class="w-100">
                </div>
                <div class="card-body">
                    <h3 class="card-title" style="color:#1C77BB;">${window.location.hostname}</h3>
                    <p class="card-text">We'd like to send you notifications for the latest news and updates.</p>

                </div>
                <hr>
                <div class="card-footer text-muted">
                <p><b>Nepal’s Leading Chatbot Company</b><br />
                Don’t let your business sleep. Automate your support and experience with chatbot 24/7. Capture leads, Complaints, Feedback and Automate tasks with human-like conversation. Create a value and meaningful experience for customers.                
                </p>

                   <span style="color:gray;">You can unsubscribe anytime</span>
                </div>
            </div>`);
    return contents.appendTo(sectiondiv)
  },

  unsuscribe: async function () {
    let visitorId = cookie.getCookie('uniqueID');
    let URL = `${env.protocol}://${env.server}:${env.port}${env.basePath}pushnotification/unsuscribe`
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitor_id: visitorId
      })
    });
    let data = await res.json();
    // console.log(data, "unsuscribe data response")
  },

  footer: async function (section) {
    let footer = await this.getVistor()
    return $(footer).appendTo(section)
  }
}