import { socketModule } from "../core/socket";

export var introModule = {
    data: "",
    init: function (data) {
        this.data = data;
        this.cacheDOM();
        this.render();
    },
    cacheDOM: function () {
        this.$frameContainer = $("#frame");
    },
    render: function () {
        this.$mainContainer = $(
            '<div class="$mainContainer" id="mainIntroPageID"></div>'
        );
        this.$mainContainer.appendTo("#frame");
        this.subIntroContainerId = $(`<div class="container" id="subIntroContainerId"></div>`)
        let bannerDiv = $(`<div id="banner" style="text-align:center;"></div>`);
        let logoSection = $(`<div class="digitalLogo"><img src="${this.data.logo}" /></div>`)
        logoSection.appendTo(bannerDiv);
        let bannerSection = $(`<div class="botBanner"><img src="${this.data.banner}" /></div>`)
        bannerSection.appendTo(bannerDiv);
        let descriptionSection = $(`<div class="botDesc"><p>${this.data.description}</p>`)
        descriptionSection.appendTo(bannerDiv);
        let buttonSection = $(`<button class="startMessageButton">${this.data.button}</button>`)
        buttonSection.appendTo(bannerDiv);
        bannerDiv.appendTo(this.subIntroContainerId);

        this.subIntroContainerId.appendTo(this.$mainContainer)

        buttonSection.click(() => {
            this.clear();
            socketModule.messageSend("menu");
        })
    },

    clear: function () {
        if (this.$mainContainer) {
            this.$mainContainer.remove();
        }
    },
};
