const token = localStorage.getItem('token');
const socket = io('http://localhost:3000');


document.querySelector('form').addEventListener('submit',(event)=>{

    event.preventDefault();
    const message = event.target.message.value
    socket.emit("chat-messages",message);
    event.target.message.value = "";
   


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

function getMessages(message){
    const messagesContainer = document.getElementById('messages');
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerText = message;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


socket.on("chat-messages",(message)=>{
    getMessages(message);
})


