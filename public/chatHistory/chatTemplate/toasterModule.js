export var toaster = {
    data: '',
    id: '',
    millisecond: 0,
    /**
     * 
     * @param { string which is shown in toaster } data 
     * @param { parent tag Id in which toaster is attached } id 
     * @param { time duration in millisecond } millisecond 
     */
    init: function(data, id, millisecond, bottom=false){
        this.data = data;
        this.id = id;
        this.millisecond = millisecond;
        this.cacheDOM();
        this.render(bottom);
        this.startTimer();
    },
    cacheDOM: function(){
        this.$parentDOM = $('#'+this.id);        
    },
    render: function(bottom){        
        this.$toasterDOM = $(`<div class="alert alert-success alert-dismissible fade show ${bottom?"bottom":"top"}" role="alert">
            <p>${this.data}</p>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`);
        
        this.$parentDOM.append(this.$toasterDOM);
    },
    startTimer: function(){
        if(this.millisecond || (this.millisecond === 0)){
            setTimeout(()=> {            
                // $('.alert').remove();
                this.clear();
            }, this.millisecond);
        }        
    },
    clear: function(){
        this.data = null;
        this.id = null;
        this.millisecond = null;
        $('.alert').remove();
    }
};