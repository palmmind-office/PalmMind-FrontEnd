/**
 * data format type is
 * [{
 * field1: value1,
 * field2: value2,
 * .
 * .
 * .
 * }
 * .
 * .]
 */
 import { socketModule } from '../core/socket';
export var genericTable = {
    data: '',
    init: function (data) {
        this.data = data;
        this.cacheDOM();
        this.render();
    },
    cacheDOM: function () {
        this.$message = $('#message-module');
    },
    generateDOM: function (tag, attribute, css, text) {
        let $dom = $(tag);
        attribute && $dom.attr(attribute);
        css && $dom.css(css);
        text && $dom.html(text);
        return $dom;
    },
    render: function () {
        if (this.$container) {
            this.$container.remove();
        }

        try {
            if (this.data.data.length) {
                
                this.$container = this.generateDOM('<div/>', { 'id': 'table-container' }, { 'width': '90%', 'margin': 'auto', 'margin-bottom': '40px' });
                let $table = this.generateDOM('<table/>', { 'class': 'table table-striped table-warning table-bordered' });
                 
                let renderTextNode = Array.isArray(this.data.title) ? (this.data.title.length > 0) : this.data.title;
                if (renderTextNode) {
                    let parentElem = this.$message.find('.message-section').find('ul');
                    let text = Array.isArray(this.data.title) ? this.data.title.join('<br>') : this.data.title;
                    let node = $(`<li class="sent"><img src="images/img/shineResunga.png" alt=""><p style="margin-bottom:5px;">${text}</p></li>`);
                    node.appendTo(parentElem);
                }
                let headerArr = Object.keys(this.data.data[0]);
                let $thead = this.generateDOM('<thead/>', {}, {'background': '#0189C7', 'color': '#f8f8f8'});
                let $headerrow = this.generateDOM('<tr/>');
                headerArr.forEach((header) => {
                    let $th = this.generateDOM('<th/>', { 'scope': 'col' }, {'border-color': '#f8f8f8' }, header);
                    $th.appendTo($headerrow);
                });
                $headerrow.appendTo($thead);

                let $tbody = this.generateDOM('<tbody/>', { 'class': 'tbody' },{  "font-size" :  "14px"});

                this.data.data.forEach((data) => {
                    let $tr = this.generateDOM('<tr/>', {}, {'background': '#f8f8f8'});
                    headerArr.forEach((header) => {
                        let $td = this.generateDOM('<td/>', {}, {'border-color':'#e2e3e4'}, data[header]);
                        $td.appendTo($tr);
                    });
                    $tr.appendTo($tbody);
                })
                $thead.appendTo($table);
                $tbody.appendTo($table);

                $table.appendTo(this.$container);

                if(this.data.hasOwnProperty('button')){
                    let btncontainer=$(`<div class="btncont"></div>`)
                    btncontainer.appendTo(this.$container);
                    this.data.button.contents.forEach(ele=>{
                        let button=$(`<button>
                        ${ele.title}</button>`).appendTo(btncontainer);
                       button.click(function(){
                           let payload=ele.payload;
                           let payloads = {title:ele.title,payload:payload};
                           let link=ele.link;
                           if(payload===undefined){
                               window.open(link, '_blank');
                           }
                           else{
                               socketModule.messageSend(payloads)
                           }
                       })
                   
                   })
           }
       
           this.$container.appendTo(this.$message);
       }
   } catch (error) {

        }
        this.scrollBottom();
    },
    scrollBottom: function () {
        $(".messages").animate({
            scrollTop: $('#message-module')[0].scrollHeight
        }, "fast");
    },
    clear: function () {
        this.init({});
    }
}