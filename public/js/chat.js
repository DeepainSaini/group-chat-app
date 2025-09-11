
document.querySelector('form').addEventListener('submit',(event)=>{

    event.preventDefault();

    const obj = {

        message : event.target.message.value
    }

    const token = localStorage.getItem('token');
    console.log(token);

    axios.post('http://localhost:3000'+"/user/chat",obj,{headers : {'Authorization' : token}}).then((result)=>{
        
        event.target.message.value = "";
        console.log('message saved successfully');

    }).catch((error)=>{
        console.log(error);
    })


})