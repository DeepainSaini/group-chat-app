
document.querySelector('form').addEventListener('submit',(event)=>{
    
    event.preventDefault();
    
    const obj = {
        name : event.target.name.value,
        email : event.target.email.value,
        number : event.target.number.value,
        password : event.target.password.value
    }

    const errorDiv = document.getElementById('errormsg');

    axios.post('http://localhost:3000'+"/user/signup",obj).then((result)=>{

        event.target.name.value = "";
        event.target.email.value = "";
        event.target.number.value = "";
        event.target.password.value = "";
        window.location.href = '/user/login'

    }).catch((error)=>{
        
        console.log(error.response.data.message);
        if(error.response.data.message === "USER ALREADY EXISTS"){
            errorDiv.textContent = "USER ALREADY EXISTS";
            setTimeout(() => {
                errorDiv.textContent = "";
            }, 4000);
        }
        else if(error.response.data.message === "USER WITH THIS EMAIL ALREADY EXISTS"){
            errorDiv.textContent = "USER WITH THIS EMAIL ALREADY EXISTS";
            setTimeout(() => {
                errorDiv.textContent = "";
            }, 4000);
        }
        else  if(error.response.data.message === "USER WITH THIS PHONE NUMBER ALREADY EXISTS"){
            errorDiv.textContent = "USER WITH THIS PHONE NUMBER ALREADY EXISTS";
            setTimeout(() => {
                errorDiv.textContent = "";
            }, 4000);
        }
        else{
            errorDiv.textContent = "Something went wrong.";
        }
    })

    
})