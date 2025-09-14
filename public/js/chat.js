const token = localStorage.getItem('token');
const socket = io('http://localhost:3000',{
    auth: {
        token: token
    }
});


document.querySelector('#message-form').addEventListener('submit',(event)=>{

    event.preventDefault();
    const message = event.target.message.value
    socket.emit("new-messages",{message:message,roomName:localStorage.getItem("roomName")});
    event.target.message.value = "";
   
})

document.getElementById('search-form').addEventListener('submit',async (event)=>{
     
    try{
        event.preventDefault();
        const email = event.target.email.value;
        event.target.email.value = "";
        const result = await axios.post('http://localhost:3000'+"/user/search",{email:email},{headers : {'Authorization' : token}});
        if(result.data.message === "user found"){
            
            const searchList = document.querySelector('.search-list');
            const list = searchList.getElementsByTagName("li"); 

            let exists = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].textContent === email) {
                    exists = true;
                    break;
                }

            }

            if(exists === false){
                
                const li = document.createElement('li');
                li.className = 'search-item';
                li.innerHTML = `${email}`;
                searchList.appendChild(li);
                li.addEventListener('click',(event)=>{
                    
                    document.getElementById('search-input').value = event.target.textContent;
                })
            }

            const myEmail = localStorage.getItem('userEmail');

            const roomName = [myEmail,email].sort().join("-");
            
            socket.emit("join-room",roomName);
            localStorage.setItem("roomName",roomName);

            alert("Room we joined " + roomName);
        }

    }catch(error){
        
        if(error.response.data.message === "user not found"){
            document.getElementById('errormsg').innerHTML = "USER NOT FOUND"
            setTimeout(()=>{
                document.getElementById('errormsg').innerHTML = "";
            },3000);

        }
        console.log(error);
    }
    
})

// async function loadMessages() {
    
//     try {

//         const result = await axios.get('http://localhost:3000'+"/user/chat",{headers : {'Authorization' : token}})
//         const messages = result.data.chats;
    

//         const messagesContainer = document.getElementById('messages');
//         messagesContainer.innerHTML = "";

//         messages.forEach(msg => {
            
//             const div = document.createElement('div')
//             div.classList.add('message');

//             const userName = msg.User ? msg.User.name : 'admin';

//             div.innerHTML = `<strong>${userName}</strong>: ${msg.content} 
//             <div class="timestamp">${new Date(msg.createdAt).toLocaleTimeString()}</div>`;
            
//             messagesContainer.appendChild(div);
//         });

//         messagesContainer.scrollTop = messagesContainer.scrollHeight;

//         console.log(messages);

//     }catch(error){
//         console.log(error);
//     }
// }

function getMessages(username,email,message){
    const messagesContainer = document.getElementById('messages');
    const div = document.createElement('div')
    div.classList.add('message');

    if (email === localStorage.getItem('userEmail')) {
        div.classList.add('my-message');   
    } else {
        div.classList.add('other-message');
    }
    div.innerHTML = `<strong>${username}</strong>: ${message}`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


socket.on("new-messages",({username,email,message})=>{
    getMessages(username,email,message);
})


