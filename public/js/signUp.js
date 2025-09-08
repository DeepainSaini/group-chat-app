
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

    }).catch((error)=>{

        if(error.response.data.message === "email already exists"){
            errorDiv.textContent = "Email already exists.";
            setTimeout(() => {
                errorDiv.textContent = "";
            }, 3000);
        }
        else{
            errorDiv.textContent = "Something went wrong.";
        }
    })

    
})