const token = localStorage.getItem('token');


window.addEventListener('DOMContentLoaded',(event)=>{

     axios.get('http://localhost:3000'+"/user/chat",{headers : {'Authorization' : token}}).then((result)=>{

        console.log(result.data.chats);

     }).catch((error)=>{

        console.log(error);
     })
})

document.querySelector('form').addEventListener('submit',(event)=>{

    event.preventDefault();

    const obj = {

        message : event.target.message.value
    }


    axios.post('http://localhost:3000'+"/user/chat",obj,{headers : {'Authorization' : token}}).then((result)=>{
        
        event.target.message.value = "";
        console.log('message saved successfully');

    }).catch((error)=>{
        console.log(error);
    })


})