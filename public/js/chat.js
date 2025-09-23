const token = localStorage.getItem('token');
const roomName = localStorage.getItem('roomName');
const socket = io('http://localhost:3000',{
    auth: {
        token: token
    }
});

window.addEventListener('DOMContentLoaded',()=>{
    loadGroups();
    loadMessages();
});


document.querySelector('#message-form').addEventListener('submit',(event)=>{

    event.preventDefault();
    const message = event.target.message.value;
    
    if(!message){
        document.getElementById('errormsg1').innerHTML = "Enter a message to send"
            setTimeout(()=>{
                document.getElementById('errormsg1').innerHTML = "";
            },3000);
            return;
    }
    
    if(localStorage.getItem("roomName")){
        socket.emit("new-messages",{message:message,roomName:localStorage.getItem("roomName")},(response)=>{
            if(response.success === true){       
                loadMessages();
            }else{
                document.getElementById('errormsg1').innerHTML = "Message not sent";
                setTimeout(()=>{
                    document.getElementById('errormsg1').innerHTML = "";
                },3000);
            }
        });
    }else{
        socket.emit("new-messages",{message:message,groupId:localStorage.getItem("groupId")},(response)=>{
            if(response.success === true){
                loadMessages();
            }else{
                document.getElementById('errormsg1').innerHTML = "Message not sent";
                setTimeout(()=>{
                    document.getElementById('errormsg1').innerHTML = "";
                },3000);
            }
        });
    }
    
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

            localStorage.removeItem("groupId");

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

document.getElementById('join-group-form').addEventListener('submit',async (event)=>{
      
    try{
        event.preventDefault();
        const groupCode = event.target.groupCode.value;
        event.target.groupCode.value = "";
        const result = await axios.post('http://localhost:3000'+`/group/search`,{groupCode:groupCode},{headers : {'Authorization' : token}});
        if(result.data.message === "Group fetched successfully"){

            const searchList = document.querySelector('.joined-groups-list-items');
            const list = searchList.getElementsByTagName("li"); 

            let exists = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].textContent === groupCode) {
                    exists = true;
                    break;
                }

            }

            if(exists === false){
                
                const li = document.createElement('li');
                li.className = 'joined-group';
                li.innerHTML = `${groupCode}`;
                searchList.appendChild(li);
                li.addEventListener('click',(event)=>{
                    
                    document.getElementById('group-code').value = event.target.textContent;
                })

                const result2 = await axios.post('http://localhost:3000'+`/group/join`,{groupId:result.data.group.id},{headers : {'Authorization' : token}});
            }

            const groupId = result.data.group.id;
            socket.emit("join-group",groupId);
            event.target.groupCode.value = "";
            localStorage.setItem("groupId",groupId);
            localStorage.removeItem("roomName");
            alert("Group we joined " + result.data.group.name);
            window.location.reload();
        }
    }catch(error){
        console.log(error);
        if(error.response.data.message === "Group not found"){
            document.getElementById('join-error').innerHTML = "Group does not exist";
            setTimeout(()=>{
                document.getElementById('join-error').innerHTML = "";
            },3000);
        }
    }
    

})

document.getElementById('create-group-form').addEventListener('submit',async (event)=>{

    try{
        event.preventDefault();
        const groupName = event.target.groupName.value;
        const result = await axios.post('http://localhost:3000'+"/group/create",{groupName:groupName},{headers : {'Authorization' : token}});

        if(result.data.message === "Group already exists"){
            document.getElementById('create-error').innerHTML = "Group already exists with this name";
            setTimeout(()=>{
                document.getElementById('create-error').innerHTML = "";
            },3000);
            return;
        }

        const groupId = result.data.groupId;
        
        socket.emit("join-group",groupId);
        event.target.groupName.value = "";
        localStorage.setItem("groupId",groupId);
        localStorage.removeItem("roomName");
        alert("Group we joined " + groupName);
    
    }catch(error){
        console.log(error);
        if(error.response.data.message === "Group already exists"){
            document.getElementById('create-error').innerHTML = "Group already exists. Please enter a different name";
            setTimeout(()=>{
                document.getElementById('create-error').innerHTML = ""
            },3000);
            return;
        }
    }
        
})

async function loadGroups(){
    
    try{
        const result = await axios.get('http://localhost:3000'+`/group/get`,{headers : {'Authorization' : token}});
        console.log(result.data);
        const myGroups = result.data.myGroups;
        const joinedGroups = result.data.joinedGroups;
        const myGroupsList = document.querySelector('.my-groups-list-items');
        const joinedGroupsList = document.querySelector('.joined-groups-list-items');
        myGroupsList.innerHTML = "";
        joinedGroupsList.innerHTML = "";
        myGroups.forEach((group) => {
            const li = document.createElement('li');
            li.innerHTML = group.name;
            li.className = 'my-group';
            myGroupsList.appendChild(li);
            li.addEventListener('click',(event)=>{
                document.getElementById('group-code').value = event.target.textContent;
            });
        });

        joinedGroups.forEach((group) => {
            const li = document.createElement('li');
            li.innerHTML = group.group.name;
            li.className = 'joined-group';
            joinedGroupsList.appendChild(li);
            li.addEventListener('click',(event)=>{
                document.getElementById('group-code').value = event.target.textContent;
            });
        });

    }catch(error){
        console.log(error);
    }
}
   

async function loadMessages() {
    
    try {
            const roomName = localStorage.getItem("roomName");
            const groupId = localStorage.getItem("groupId");
            let messages;
            if(roomName){
            const result = await axios.get('http://localhost:3000'+`/user/chat?roomName=${roomName}`,{headers : {'Authorization' : token}})
                messages = result.data.chats;
                console.log(messages);
            }else{
                const result = await axios.get('http://localhost:3000'+`/group/chat?groupId=${groupId}`,{headers : {'Authorization' : token}})
                messages = result.data.messages;
                console.log(messages);
            }
        

            const messagesContainer = document.getElementById('messages');
            messagesContainer.innerHTML = "";

            messages.forEach(msg => {
                
                const div = document.createElement('div')
                div.classList.add('message');
                if (msg.user.email === localStorage.getItem('userEmail')) {
                    div.classList.add('my-message');   
                } else {
                    div.classList.add('other-message');
                }

                const userName = msg.user ? msg.user.name : 'admin';

                div.innerHTML = `<strong>${userName}</strong>: ${msg.content} 
                <div class="timestamp">${new Date(msg.createdAt).toLocaleTimeString()}</div>`;
                
                messagesContainer.appendChild(div);
        });

                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                console.log(messages);

    }catch(error){
        console.log(error);
        if(error.response.data.message === "Group not found"){
            document.getElementById('errormsg1').innerHTML = "Group does not exist";
            setTimeout(()=>{
                document.getElementById('errormsg1').innerHTML = "";
            },3000);
        }
    }
}

function getMessages(username,email,message,createdAt){

    const messagesContainer = document.getElementById('messages');
    const div = document.createElement('div')
    div.classList.add('message');

    if (email === localStorage.getItem('userEmail')) {
        div.classList.add('my-message');   
    } else {
        div.classList.add('other-message');
    }

    div.innerHTML = `<strong>${username}</strong>: ${message} 
    <div class="timestamp">${new Date(createdAt).toLocaleTimeString()}</div>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


socket.on('connect', () => {
    if (roomName) socket.emit('join-room', roomName); // re-subscribe after every connect
});


socket.on("new-messages",({username,email,message,createdAt})=>{
    getMessages(username,email,message,createdAt);
})


