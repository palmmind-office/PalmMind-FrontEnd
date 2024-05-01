function FadeBackModal(continueFn,exitFn,bodyText,bindEvent){
     try{
      $('#rememberVisitor').remove()
        let cacheDOm=$('#message-module .message-section');
        let modalAppendDiv=$(`<div class="modal fade" id="rememberVisitor" role="dialog" data-backdrop="static" data-keyboard="false"></div>`);
        modalAppendDiv.appendTo(cacheDOm)
            modalAppendDiv.css({
            "position": "absolute",
            "background-color": "rgb(0 0 0 / 38%)",
            "height": "100%",
            "width": "100%",
            "z-index": "99999999999"
            })
            let modalDiv = $(`<div class="modal-dialog palmmind-dialogue"></div>`).appendTo(modalAppendDiv);
            modalDiv.css({
            "top": "25%",
            })
            let modalContent = $(`<div class="modal-content"><div>`)
            modalContent.css({
            "position": "absolute",
            "display": "flex",
            "flex-direction": "column",
            "background": "#fff",
            "margin": "30px",
            "border-radius": "20px",
            "border": "2px solid #0171bb",
            "text-align": "center",
            "justify-content": "center",
            "width": "unset",
            "top":"-55px"
            })
            let modalHeader = $(`<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button></div>`);
            let modalBody = $(`<div class="modal-body" style="margin-bottom: -30px;"><p style="color:#0171bb;font-weight:800;">${bodyText}</p></div>`);
            let modalFooter = $(`<div class="modal-footer"></div>`);
            modalFooter.css({
            "display": "flex",
            "justify-content": "center",
            "flex-direction": "row",
            "gap": "2rem",
            })
            let continueBtn = $(`<button type="button" id="rememberVisitorContinue" class="btn btn-primary" data-dismiss="modal">Yes</button>`).appendTo(modalFooter);
            let exitBtn = $(`<button type="button" id="rememberVisitorexist" class="btn btn-primary" data-dismiss="modal" style="background:#bf1c1c;border:unset;">No</button>`).appendTo(modalFooter);
            continueBtn.on('click',continueFn.bind(bindEvent))
            exitBtn.on('click',exitFn.bind(bindEvent))
            modalAppendDiv.modal('show');
            // modalHeader.appendTo(modalContent)
            modalBody.appendTo(modalContent)
            modalFooter.appendTo(modalContent)
            modalContent.appendTo(modalDiv);
     }catch(error){
        console.log(error)
     }
}

export {FadeBackModal}