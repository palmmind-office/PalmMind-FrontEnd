export const PostService = async(url,leads)=>{
    const res =  await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leads)
    }),
    data = await res.json();
        try{
            if(data.data.code === "000"){
                return data.data.selectList
            }
            else{
                return data.data
            }
        }catch(err){
            console.log(err)
            return data
        }
}

export const PostInterest = async(url,leads)=>{
    const res =  await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leads)
    }),
    data = await res.json();
    if(data.status === "success"){
        if(!data.data.interest == ''){
            localStorage.setItem('interest',data.data.interest)
        }
        return data
    }else{
        return data
    }
}