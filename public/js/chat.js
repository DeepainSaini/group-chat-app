// const token = localStorage.getItem('token');



// document.querySelector('form').addEventListener('submit',(event)=>{

//     event.preventDefault();

//     const obj = {

//         message : event.target.message.value
//     }


//     axios.post('http://localhost:3000'+"/user/chat",obj,{headers : {'Authorization' : token}}).then((result)=>{
        
//         event.target.message.value = "";
//         console.log('message saved successfully');

//     }).catch((error)=>{
//         console.log(error);
//     })


// })

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

// setInterval(loadMessages,2000);

const socket = new WebSocket("ws://localhost:3000");
const messagesContainer = document.getElementById('messages');

socket.onmessage = async (event)=>{
    const div = document.createElement('div')
    div.classList.add('message');

    div.innerText = await event.data;
    messagesContainer.appendChild(div);
}

function send(event) {
    event.preventDefault();
    const text = document.getElementById("message-input").value;
    socket.send(text);
}

