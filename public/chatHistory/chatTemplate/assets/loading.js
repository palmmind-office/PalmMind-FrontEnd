/**
 * Used for loading data.
 */
export var loading = {
    data: {},
    init: function(parentID){
        this.parentID = parentID;
        this.cacheDOM();
        this.render();
    },
    cacheDOM: function(){
        this.$parent = $(this.parentID);
    },
    render: function(){
        let $img = $(`<img id="loading" src="./img/spinner.gif" alt="loading" width="50" height="50"/>`);
        let $loading = $('#loading');
        if(Object.keys($loading).length === 0){
            $img.appendTo(this.$parent);
        }
    },
    clear: function(){
        $('#loading').remove();
    }
}