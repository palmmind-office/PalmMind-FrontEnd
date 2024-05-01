export var toggleBot = {
    Toggle(){
        console.log("tooogle",$('#round-btn').parent())
        $('.cross-btn').click(()=>{
        $('#palmbot').remove('.toggle')      
        $('#round-btn').remove('.toggle')
        $('#round-btn').css('visibility:visible')
        // $('.round-btn-img').setAttribute(
        //     "src",
        //     `${this.baseUrl}/images/menu/reliableicon.png`
        // );
        })
}
}