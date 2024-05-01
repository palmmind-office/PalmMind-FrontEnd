const { generallistTable } = require("../general/generallistTable")
const { generalReplyModule } = require("../Module/generalReplyModule")
const { ListItemModule } = require("../Module/ListItemModule")
const { renderPreviousButton } = require("./renderPrevButton")

const policySerrvice = (data) => {
    let list = []

    if(!data.hasOwnProperty('for')){
        generalReplyModule.init(data.message || "Successfully Submited")
        renderPreviousButton.init()
    }
    // for policy revive check
    if (data.for === 'PolicyReviveCheck') {
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].policyNo) {
                list.push(
                    {
                        subtitle: `<b>policy Number:</b> ${data.data.data[0].policyNo}`,
                    }
                )
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<B>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].maturityDate) {
                list.push({
                    subtitle: `<b>Maturity Date: </b>${data.data.data[0].maturityDate}`,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: `<b>Next Due Date On:</b> ${data.data.data[0].nextDueDate}`,
                })
            }
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }

            if (data.data.data[0].planName) {
                list.push({
                    subtitle: '<b>Plan Name:</b> ' + data.data.data[0].planName,
                })
            }
            if (data.data.data[0].payMode) {
                list.push({
                    subtitle: '<b>Pay Mode:</b> ' + data.data.data[0].payMode,
                })
            }
            if (data.data.data[0].payingTerm) {
                list.push({
                    subtitle: '<b>Paying Term:</b> ' + data.data.data[0].payingTerm,
                })
            }
            if (data.data.data[0].nomineeName) {
                list.push(
                    {
                        subtitle: '<b>Nominee Name: </b>' + data.data.data[0].nomineeName,
                    })
            }
            if (data.data.data[0].nomineeRelation) {
                list.push({
                    subtitle: '<b>Nomionee Status :</b> ' + data.data.data[0].nomineeRelation,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your details is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            }

            ListItemModule.clear();
            ListItemModule.init(listItemdata);
        } else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        }
    }
    // for policy revive request
    if (data.for === 'PolicyReviveRequest') {
        generalReplyModule.init(data.data.message)
        renderPreviousButton.init()
    }
// for paymode change check
    if (data.for === 'PaymodeChangeCheck') {
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }
            if (data.data.data[0].sumAssured) {
                list.push({
                    subtitle: '<b>Sum Assured:</b> ' + data.data.data[0].sumAssured,
                })
            }
            if (data.data.data[0].term) {
                list.push({
                    subtitle: '<b>Term:</b> ' + data.data.data[0].term,
                })
            }
            if (data.data.data[0].payMode) {
                list.push({
                    subtitle: '<b>Paymode:</b> ' + data.data.data[0].payMode,
                })
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<b>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].maturityDate) {
                list.push({
                    subtitle: '<b>Maturity Date:</b> ' + data.data.data[0].maturityDate,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: '<b>Next Due Date:</b> ' + data.data.data[0].nextDueDate,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your paymod change details is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            }

            ListItemModule.clear();
            ListItemModule.init(listItemdata);
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        }
    }
if(data.for === 'PaymodeChangeRequest'){
    generalReplyModule.init(data.data.message)
    renderPreviousButton.init()
}
    // for paymode change request
    if(data.for === 'MobileNumberChange'){
        generalReplyModule.init(data.data.message)
        renderPreviousButton.init()
    }
    // for occupation change check
    if(data.for === 'OccupationChangeCheck'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].hasOwnProperty('policyNo')) {
                list.push({
                    subtitle: '<b>Policy Number:</b> ' + data.data.data[0].policyNo,
                })
            }
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }
            if (data.data.data[0].hasOwnProperty('planName')) {
                list.push({
                    subtitle: '<b>Plan Name:</b> ' + data.data.data[0].planName,
                })
            }
            if (data.data.data[0].hasOwnProperty('dob')) {
                list.push({
                    subtitle: '<b>Date of Birth:</b> ' + data.data.data[0].dob,
                })
            }
           
            if (data.data.data[0].sumAssured) {
                list.push({
                    subtitle: '<b>Sum Assured:</b> ' + data.data.data[0].sumAssured,
                })
            }
            if (data.data.data[0].term) {
                list.push({
                    subtitle: '<b>Term:</b> ' + data.data.data[0].term,
                })
            }
            if (data.data.data[0].hasOwnProperty('payingTerm')) {
                list.push({
                    subtitle: '<b>Paying Term:</b> ' + data.data.data[0].payingTerm,
                })
            }
            if (data.data.data[0].payMode) {
                list.push({
                    subtitle: '<b>Paymode:</b> ' + data.data.data[0].payMode,
                })
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<b>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].maturityDate) {
                list.push({
                    subtitle: '<b>Maturity Date:</b> ' + data.data.data[0].maturityDate,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: '<b>Next Due Date:</b> ' + data.data.data[0].nextDueDate,
                })
            }
            if (data.data.data[0].hasOwnProperty('mobile')) {
                list.push({
                    subtitle: '<b>Mobile:</b> ' + data.data.data[0].mobile,
                })
            }
            if (data.data.data[0].hasOwnProperty('nomineeName')) {
                list.push({
                    subtitle: '<b>Nominee Name:</b> ' + data.data.data[0].nomineeName,
                })
            }
            if (data.data.data[0].hasOwnProperty('nomineeRelation')) {
                list.push({
                    subtitle: '<b>Nominee Relation:</b> ' + data.data.data[0].nomineeRelation,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your details is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            }

            ListItemModule.clear();
            ListItemModule.init(listItemdata);
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        }
    }

    // for occupation change request
    if(data.for === 'OccupationChangeRequest'){
        generalReplyModule.init(data.data.message)
        renderPreviousButton.init()
    }

    // for premium paid history
    if(data.for === 'PremiumPaidHistory'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }
            if (data.data.data[0].sumAssured) {
                list.push({
                    subtitle: '<b>Sum Assured:</b> ' + data.data.data[0].sumAssured,
                })
            }
            if (data.data.data[0].term) {
                list.push({
                    subtitle: '<b>Term:</b> ' + data.data.data[0].term,
                })
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<b>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: '<b>Next Due Date:</b> ' + data.data.data[0].nextDueDate,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your Premium Paid History details is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            }
            let premiumpaid = data
            generallistTable.clear();
            generallistTable.init(listItemdata,premiumpaid)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        }
    }

    // for checkpremium due 
    if(data.for === 'CheckDuePremium'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }
            if (data.data.data[0].sumAssured) {
                list.push({
                    subtitle: '<b>Sum Assured:</b> ' + data.data.data[0].sumAssured,
                })
            }
            if (data.data.data[0].term) {
                list.push({
                    subtitle: '<b>Term:</b> ' + data.data.data[0].term,
                })
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<b>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: '<b>Next Due Date:</b> ' + data.data.data[0].nextDueDate,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your Premium Due details is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            }
            let premiumpaid = data
            generallistTable.clear();
            generallistTable.init(listItemdata,premiumpaid)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        }  
    }
    // for lapseplocy
    if(data.for === 'CheckLapsePolicy'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }
            if (data.data.data[0].sumAssured) {
                list.push({
                    subtitle: '<b>Sum Assured:</b> ' + data.data.data[0].sumAssured,
                })
            }
            if (data.data.data[0].term) {
                list.push({
                    subtitle: '<b>Term:</b> ' + data.data.data[0].term,
                })
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<b>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: '<b>Next Due Date:</b> ' + data.data.data[0].nextDueDate,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your Lapse Policy details Due is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            } 
            ListItemModule.clear()           
            ListItemModule.init(listItemdata)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        } 
    }

    // for Nominee Change Check
    if (data.for === 'NomineeChangeCheck') {
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].policyHolderName) {
                list.push({
                    subtitle: '<b>Policy Holder Name:</b> ' + data.data.data[0].policyHolderName,
                })
            }
            if (data.data.data[0].sumAssured) {
                list.push({
                    subtitle: '<b>Nominee Name:</b> ' + data.data.data[0].nomineeName,
                })
            }
            if (data.data.data[0].term) {
                list.push({
                    subtitle: '<b>Nominee Relation:</b> ' + data.data.data[0].nomineeRelation,
                })
            }
            if (data.data.data[0].premium) {
                list.push({
                    subtitle: '<b>Premium:</b> ' + data.data.data[0].premium,
                })
            }
            if (data.data.data[0].nextDueDate) {
                list.push({
                    subtitle: '<b>Next Due Date:</b> ' + data.data.data[0].nextDueDate,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].policyHolderName}, your details is as follows.`,
                subtitle: `${data.data.data[0].policyHolderName}`,
                type: "ListItem",
                data: list
            } 
            ListItemModule.clear()           
            ListItemModule.init(listItemdata)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        } 
    }
    // Nominee change request 
        if(data.for === 'NomineeChangeRequest'){
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        }

// for agent services 
if(data.for === 'PanNumberCheck'){
    if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
        if (data.data.data[0].name) {
            list.push({
                subtitle: '<b>Agent Name:</b> ' + data.data.data[0].name,
            })
        }
        if (data.data.data[0].licenseNo) {
            list.push({
                subtitle: '<b>License No:</b> ' + data.data.data[0].licenseNo,
            })
        }
        if (data.data.data[0].licenseIssueDate) {
            list.push({
                subtitle: '<b>License Issue Date:</b> ' + data.data.data[0].licenseIssueDate,
            })
        }
        if (data.data.data[0].licenseExpiryDate) {
            list.push({
                subtitle: '<b>License Expiry Date:</b> ' + data.data.data[0].licenseExpiryDate,
            })
        }
        if (data.data.data[0].panNo) {
            list.push({
                subtitle: '<b>Pan No:</b> ' + data.data.data[0].panNo,
            })
        }
        let listItemdata = {
            title: `Dear ${data.data.data[0].name}, your details is as follows.`,
            subtitle: `${data.data.data[0].name}`,
            type: "ListItem",
            data: list
        }  
        ListItemModule.clear();          
        ListItemModule.init(listItemdata)
    }else {
        generalReplyModule.init(data.data.message)
        renderPreviousButton.init()
    } 
}
    // for agent pan Update request
    if(data.for === 'PanNumberUpdateRequest'){
        generalReplyModule.init(data.data.message)
        renderPreviousButton.init()
    }
    // for agent bank account number change request
    if(data.for === 'BankAccountChangeRequest'){
        generalReplyModule.init(data.data.message)
        renderPreviousButton.init()
    }
    // for Business Details 
    if(data.for === 'BusinessDetails'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].name) {
                list.push({
                    subtitle: '<b>Agent Name:</b> ' + data.data.data[0].name,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].name}, your Business details is as follows.`,
                subtitle: `${data.data.data[0].name}`,
                type: "ListItem",
                data: list
            }  
            let premiumpaid = data   
            generallistTable.clear();       
            generallistTable.init(listItemdata,premiumpaid)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        } 
    }

    // for agent due business details 
    if(data.for === 'DueBusinessDetails'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].name) {
                list.push({
                    subtitle: '<b>Agent Name:</b> ' + data.data.data[0].name,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].name}, your Due Business details is as follows.`,
                subtitle: `${data.data.data[0].name}`,
                type: "ListItem",
                data: list
            }  
            let premiumpaid = data   
            generallistTable.clear();       
            generallistTable.init(listItemdata,premiumpaid)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        } 
    }

    // for agent commission details 
    if(data.for === 'Commission'){
        if (!(data.data.data === null || data.data.data === undefined || data.data.data === "")) {
            if (data.data.data[0].name) {
                list.push({
                    subtitle: '<b>Agent Name:</b> ' + data.data.data[0].name,
                })
            }
            let listItemdata = {
                title: `Dear ${data.data.data[0].name}, your Commission Details is as follows.`,
                subtitle: `${data.data.data[0].name}`,
                type: "ListItem",
                data: list
            }  
            let premiumpaid = data   
            generallistTable.clear();       
            generallistTable.init(listItemdata,premiumpaid)
        }else {
            generalReplyModule.init(data.data.message)
            renderPreviousButton.init()
        } 
    }


}
module.exports = policySerrvice