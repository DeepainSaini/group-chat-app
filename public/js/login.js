
document.querySelector('form').addEventListener('submit',(event)=>{
      
    event.preventDefault();

    const obj = {
        
        email : event.target.email.value,
        number : event.target.number.value,
        password : event.target.password.value
    }

    const errorDiv = document.getElementById('errormsg');

    axios.post('http://localhost:3000'+"/user/login",obj).then((resullt)=>{

        alert('User Logged In Successfully');
        localStorage.setItem('userEmail',obj.email);
        event.target.email.value = "";
        event.target.number.value = "";
        event.target.password.value = "";
        localStorage.setItem('token',resullt.data.token);
        window.location.href = '/user/chatpage'

    }).catch((error)=>{

        if(error.response.data.message === "user does not exist please signup"){

            errorDiv.textContent = 'USER DOEST NOT EXIST. PLEASE SIGNUP';
            setTimeout(()=>{
                errorDiv.textContent = "";
            },3000);
        }
        else if(error.response.data.message === "phone number doesn't match this email"){

            errorDiv.textContent = "PHONE NUMBER DOESN'T MATCH WITH EMAIL.";
            setTimeout(()=>{
                errorDiv.textContent = "";
            },3000);
        }
        else if(error.response.data.message === "email not registered please sign up"){

            errorDiv.textContent = "EMAIL NOT REGISTERED. PLEASE SIGNUP";
            setTimeout(()=>{
                errorDiv.textContent = "";
            },3000);
        }
        else if(error.response.data.message === "Incorrect Password"){
            
            errorDiv.textContent = "INCORRECT PASSWORD";
            setTimeout(()=>{
                errorDiv.textContent = "";
            },3000)
        }
        else{
            console.log(error);
            errorDiv.textContent = "SOMETHING WENT WRONG";
            setTimeout(()=>{
                errorDiv.textContent = "";
            },3000);
        }
    })
})