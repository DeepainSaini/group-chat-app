
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
        event.target.email.value = "";
        event.target.number.value = "";
        event.target.password.value = "";
        localStorage.setItem('token',resullt.data.token);

    }).catch((error)=>{

        if(error.response.data.message === "User Does Not Exist"){

            errorDiv.textContent = 'USER DOEST NOT EXIST';
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