import { env } from "../../env";

export var generallistTable = {
    data: {},
    premium: [],
    datavalue: '',
    init: function (data, premium) {
        this.data = data
        console.log(this.data)
        this.premium = premium
        this.cacheDOM();
        this.render();

    },
    scrollBottom: function () {
        $(".messages").animate({
            scrollTop: $('#message-module')[0].scrollHeight
        }, "fast");
    },
    cacheDOM: function () {
        this.$parentElem = $('#message-module');
    },
    render: function () {
        let sn=0; 
        this.container = $('<div id="generallistTable" class="generallist mb-3"></div>');
        let renderTextNode = Array.isArray(this.data.title) ? (this.data.title.length > 0) : this.data.title;
        if (renderTextNode) {
            let parentElem = this.$parentElem.find('.message-section').find('ul');
            let text = Array.isArray(this.data.title) ? this.data.title.join('<br>') : this.data.title;
            let node = $(`<li class="sent"><img src="${env.Orgimg}" alt=""><p style="margin-bottom:5px;">${text}</p></li>`);
            node.appendTo(parentElem);
        }
        this.parentDiv = $('<div class="padding_head"></div>');
        this.headerDiv = $('<div class="heading_background text-center"></div>')
        this.subheading = $('<h5 class="padding6 text-light">' + this.data.subtitle + '</h5>');
        this.subheading.appendTo(this.headerDiv);
        let line = $('<hr class="line_heading">');
        line.appendTo(this.headerDiv);
        this.headerDiv.appendTo(this.parentDiv);
        this.content = $('<div class="table_li text_size padding_list"></div>');
        this.data.data.map((element) => {
            $(`<p>${element.subtitle}</p>`).appendTo(this.content);
        })
        let line1 = $('<hr>');
        line1.appendTo(this.content);
        this.content.appendTo(this.parentDiv);


        // for premium due

        this.premiumDiv = $('<div class="premium_due padding_list"></div>');
        this.premiumlist = $('<div></div>');

        if (this.premium.for === 'PremiumPaidHistory') {
            var values = this.premium.data.premiumPaid.map((element) => ({
                paidDate: element.paidDate,
                premiumAmount: element.premiumAmount,
                LateFee: element.latefee,
                rebateAmount: element.rebateAmount,
                instalment: element.instalment
            }))
            this.datavalue = {
                data: values
            }
            this.datavalue.data.forEach((element) => {
               sn=sn+1;
                this.list = $('<div class="list_item"></div>');
                this.list.appendTo(this.premiumlist);
                this.list_data = $(`<p class="text_size table_gli"><b>S.N.${sn}:</b><br/><b>PaidDate: </b>${element.paidDate}<br><b>PremiumAmount: </b>${element.premiumAmount} <br><b>LateFee: </b>${element.LateFee} <br><b>RebateAmount: </b>${element.rebateAmount} <br><b>Instalment: </b>${element.instalment}</p>`);
                this.list_data.appendTo(this.list);
            })
        }
        if (this.premium.for === 'CheckDuePremium') {
            var value = this.premium.data.duePremium.map((element) => ({
                lapseDays: element.lapseDays,
                interest: element.interest,
                totalPrem: element.totalPrem,
            }))
            this.datavalue = {
                data: value
            }
            this.datavalue.data.forEach((element) => {
                sn=sn+1;
                this.list = $('<div class="list_item"></div>');
                this.list.appendTo(this.premiumlist);
                this.list_data = $(`<p class="text_size table_gli"><b>S.N.${sn}:</b><br/><b>LapseDays: </b>${element.lapseDays}<br><b>Interest: </b>${element.interest} <br><b>Total Premium: </b>${element.totalPrem}</p>`);
                this.list_data.appendTo(this.list);
            })
        }

        if (this.premium.for === 'BusinessDetails') {
            var value = this.premium.data.business.map((element) => ({
                policyHolderName: element.policyHolderName,
                sumAssured: element.sumAssured,
                premium: element.premium,
                term: element.term
            }))
            this.datavalue = {
                data: value
            }
            this.datavalue.data.forEach((element) => {
                sn=sn+1;
                this.list = $('<div class="list_item"></div>');
                this.list.appendTo(this.premiumlist);
                this.list_data = $(`<p class="text_size table_gli"><b>S.N.${sn}:</b><br/><b>Policy Holder Name: </b>${element.policyHolderName}<br><b>SumAssured: </b>${element.sumAssured} <br><b> Premium: </b>${element.premium} <br><b>Term: </b>${element.term} </p>`);
                this.list_data.appendTo(this.list);
            })
        }

        if (this.premium.for === 'DueBusinessDetails') {
            var value = this.premium.data.business.map((element) => ({
                policyNo: element.policyNo,
                policyHolderName: element.policyHolderName,
                payingTerm: element.payingTerm,
                paymode: element.payMode,
                premium: element.premium,
                nextDueDate: element.nextDueDate
            }))
            this.datavalue = {
                data: value
            }
            this.datavalue.data.forEach((element) => {
                sn=sn+1;
                this.list = $('<div class="list_item"></div>');
                this.list.appendTo(this.premiumlist);
                this.list_data = $(`<p class="text_size table_gli"><b>S.N.${sn}:</b><br/><b>Policy No: </b>${element.policyNo}<br><b>Policy Holder Name: </b>${element.policyHolderName}<br><b>PayingTerm: </b>${element.payingTerm}<br><b>Paymode: </b>${element.paymode} <br><b> Premium: </b>${element.premium} <br><b>NextDueDate: </b>${element.nextDueDate} </p>`);
                this.list_data.appendTo(this.list);
            })
        }

        if (this.premium.for === 'Commission') {
            var value = this.premium.data.commission.map((element) => ({
                policyNo: element.policyNo,
                policyHolderName: element.policyHolderName,
                sumAssured: element.sumAssured,
                premium: element.premium,
                commissionAmount: element.commissionAmount,
                netCommissionAmount: element.netCommissionAmount
            }))
            this.datavalue = {
                data: value
            }
            this.datavalue.data.forEach((element) => {
               sn=sn+1;
                this.list = $('<div class="list_item"></div>');
                this.list.appendTo(this.premiumlist);
                this.list_data = $(`<p class="text_size table_gli"><b>S.N.${sn}:</b><br/><b>Policy No: </b>${element.policyNo}<br><b>Policy Holder Name: </b>${element.policyHolderName}<br><b>SumAssured: </b>${element.sumAssured}<br><b>Premium: </b>${element.premium} <br><b>CommissionAmount: </b>${element.commissionAmount} <br><b>NetCommissionAmount: </b>${element.netCommissionAmount} </p>`);
                this.list_data.appendTo(this.list);
            })
        }
        this.premiumlist.appendTo(this.premiumDiv);
        this.premiumDiv.appendTo(this.parentDiv);

        this.parentDiv.appendTo(this.container);
        this.container.appendTo(this.$parentElem);
        this.scrollBottom();


    },
    clear: function () {
        if (this.container) {
            this.container.remove();
        }
    }
}