import { env } from '../../env';
export function getUser(){
   let id= localStorage.getItem('userId');
   let token= localStorage.getItem('token')
   let userlist=[];
    fetch(`${env.protocol}://${env.DASHBOARD_SERVER}:${env.DASHBOARD_PORT}/rest/v1/Users/${id}?access_token=${token}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access_token": token
        }
    })
    .then((res) => res.json()).then((data) => {
        // console.log(data)
     });
}