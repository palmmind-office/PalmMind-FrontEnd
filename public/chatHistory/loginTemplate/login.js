import { env } from '../../env';

(function(){
    let loginFormModule = {
        init: function(){
            const inputs = document.querySelectorAll(".input");
            function addcl(){
                let parent = this.parentNode.parentNode;
                parent.classList.add("focus");
            }

            function remcl(){
                let parent = this.parentNode.parentNode;
                if(this.value == ""){
                    parent.classList.remove("focus");
                }
            }
            inputs.forEach(input => {
                input.addEventListener("focus", addcl);
                input.addEventListener("blur", remcl);
            });
            this.addEventListener();
        },
        addEventListener: function(){
            document.getElementById('login').addEventListener('click', this.login.bind(this));
            document.getElementById('email').addEventListener('keyup', this.enter.bind(this));
            document.getElementById('password').addEventListener('keyup', this.enter.bind(this));
        },
        enter: function(event){
            if(event.keyCode === 13){
                this.login();
            }
        },
        login: function(event){
            let username = document.getElementById('email').value;
            let password = document.getElementById('password').value;
            let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}chat/login`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ref: 'livechat',
                    identifier: username,
                    password: password
                })
            })
            .then(data =>data.json())
            .then((response) => {
                if(response.msg && response.msg.error){
                    return this.renderError(response.msg.error && response.msg.error.message);
                }
                if(response.hasOwnProperty('error')){
                    return this.renderError(response.error.message || response.error); 
                }
                localStorage.setItem('userId', response.msg.userId);
                localStorage.setItem('token', response.msg.id);
                fetch(`${env.protocol}://${env.server}:${env.port}/rest/v1/users/${response.msg.userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: response.msg.id
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data)
                    localStorage.setItem('userName', (data.data.firstname + ' ' + data.data.lastname));
                    window.location.href = `${env.protocol}://${env.server}:${env.port}/chat/converse`;
                })
                .catch((err) => {
                    console.log(err,"livechat login error")
                    // window.location.href = `${env.protocol}://${env.server}:${env.port}/chat`;
                }) 
            })
            .catch((err)=>{
                this.renderError(err.message);
            })
        },
        renderError: function(msg){
            $('#error').text(msg);
        }
    }

    loginFormModule.init();

})();
