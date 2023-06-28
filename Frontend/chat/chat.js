
const socket = io();
const token = localStorage.getItem('token');
const decodedToken = parseJwt(token);
const userid = decodedToken.userId;
const userName = decodedToken.name;

socket.on('receive-message', message => {
    incomingMessage(message)
})

  socket.on('receive-joinMessage', (message) => {
    const messages = document.getElementById('messages');
    messages.innerHTML += `<div><p>${message}</p></div`;
  })

  socket.on('fileUrl', fileUrl => {
    incomingFile (fileUrl);
  })
  

async function sendChat(event){
    try{
    event.preventDefault();
    const message = event.target.message.value;
    const sendmessage = `${userName}: ${message}`
    const chatMessage = {
        message
        }
    const gtoken = localStorage.getItem('gtoken');
    const decoded_gtoken = parseJwt(gtoken);

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if(!file && !message) {
        console.log('nothing to send');
        return;
    }

    if(file) {
        console.log('file present');
        const reader = new FileReader();
        reader.onload = (event) => {
            const Data = {
                name: file.name,
                type: file.type,
                data: event.target.result
            };
                outputMessage(message);
                socket.emit('send-message', sendmessage,decoded_gtoken.gId,decoded_gtoken.groupname);
                socket.emit('file',Data,decoded_gtoken.gId,decoded_gtoken.groupname);
            
        }

        reader.readAsArrayBuffer(file);
        fileInput.value='';
    }else{
        outputMessage(message);
        socket.emit('send-message', sendmessage,decoded_gtoken.gId,decoded_gtoken.groupname);
    }
    

    const token = localStorage.getItem('token');
    const response = await axios.post("http://Localhost:3000/group/add-chat",chatMessage, { headers: {"Authorization" : token, "Gauthorization" : gtoken}}) 
    if(response.status === 201){
            document.getElementById('message').value = ''
        } 
}catch(error)
    {
        console.log(JSON.stringify(error))
       document.body.innerHTML += `<div style="color:red;">${error.message}</div>`; 
    }
    
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function outputMessage(message) {
    const messages = document.getElementById('messages')
    messages.innerHTML += `<div class="message outgoing"><p>${message}</p></div`;
}

function joinMessage(message) {
    const messages = document.getElementById('messages')
    messages.innerHTML += `<p>${message}</P>` 
}

function incomingMessage (message) {
    const messages = document.getElementById('messages')
    messages.innerHTML += `<div class="message incoming"><p>${message}</p></div`;
}

function incomingFile (fileUrl) {
    const messages = document.getElementById('messages')
    messages.innerHTML += `<div class="message incoming"><a href=${fileUrl}>File Received</a></div`;
}

async function getGroupChat(groupid, groupname) {
    try{
        const token = localStorage.getItem('token');
        const groupelement = document.getElementById(groupname);
        groupelement.classList.add("active");
        const response = await axios.get(`http://Localhost:3000/group/get-chat/${groupid}`, { headers: {"Authorization" : token}});
        if(response.status === 200){

            console.log(response);
            document.getElementById('main').style.visibility = "visible";
            localStorage.setItem('gtoken', response.data.gtoken)
            const messages = document.getElementById('messages')
            messages.innerHTML = '';

            response.data.groupchatmessages.forEach(element => {
                if(element.userId == userid){
                    messages.innerHTML += `<div class="message outgoing">
                                                <p>${element.message}</p>
                                            </div>`
                }
                else{
                    messages.innerHTML += `<div class="message incoming">
                                                        <p>${element.name}: ${element.message}</p>
                                                    </div>`
                }
                
                })
            } 

            const gtoken = localStorage.getItem('gtoken')
            const decoded_gtoken = parseJwt(gtoken);
            if(decoded_gtoken.Admin === true){
                    document.getElementById('addusers-button').style.visibility="visible";
                    document.getElementById('remove-users').style.visibility="visible";   
            }
            socket.emit('join-message',userName,decoded_gtoken.groupname);
            
            socket.emit('joinGroup', userid,decoded_gtoken.gId,decoded_gtoken.groupname);

            socket.on('disconnect-message', userName, decoded_gtoken.groupname)
        }
        catch(err)
        {
            console.log(err)
        }
}


window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get("http://Localhost:3000/group/get-groups", { headers: {"Authorization" : token}});
        console.log(response);
        if(response.status === 200){
            const groups = document.getElementById('groups');
            response.data.usergroups.forEach((element) => {
                const groupelement = `<li onclick="getGroupChat(${element.id},'${element.name}')" id="${element.name}"><a href="#">${element.name}</a></li>`
                groups.innerHTML += groupelement;
                })
        }
    }
        catch(err)
        {
            console.log(err)
        }
})


document.getElementById('groupButton').onclick = async function (e) {
    try{
        window.location.href = "../group/createForm.html"
    }catch(err) {
        console.log(err);
    }
}



const dialog = document.getElementById('myFirstDialog');

document.getElementById('addusers-button').onclick = async function() {
    try{
        dialog.show(); 
        const token = localStorage.getItem('token');
        const response = await axios.get("http://Localhost:3000/user/get-users", { headers: {"Authorization" : token}});
        console.log(response);
        const users = document.getElementById('users');
        users.innerHTML = ''
        response.data.allUsers.forEach((element) => {
            if(element.id != userid){
                findUserIfExist(element.id, element.name)
            }
        }) 
    }catch(err) {
        console.log(err);
    }       
};


document.getElementById('hide').onclick = function() {    
    dialog.close();    
};

async function adduser(id,name) {
    try{
        const useridforgrp = {
            id,
            name
        }
        const adduserbutton = document.getElementById(id);
        adduserbutton.style.visibility = "hidden";
        const token = localStorage.getItem('token');
        const gtoken = localStorage.getItem('gtoken');
        const response = await axios.post("http://Localhost:3000/group/add-users",useridforgrp ,{ headers: {"Authorization" : token, "Gauthorization" : gtoken}}) 
        if(response.status === 201){
            alert(response.data.message);
        }
    }catch(err) {
        console.log(err);
    }
}

async function findUserIfExist(id,name){
    try{
        const uid = id;
        const uname = name;
        const guserid = {
            uid
        }
        const token = localStorage.getItem('token');
        const gtoken = localStorage.getItem('gtoken');
        const response = await axios.post("http://Localhost:3000/group/find-user",guserid,{ headers: {"Authorization" : token, "Gauthorization" : gtoken}})
        if(response.status === 200){
                if(response.data.message === 'exists'){
                    users.innerHTML += `<li>${uname}</li>`
                }
                else{
                    users.innerHTML += `<li>${uname}<button id='${uid}' onclick="adduser(${uid},'${uname}')">Add</button></li>`
                }
        }
    }
        
    catch(err) {
        console.log(err);
    }
}

document.getElementById('removeusers-button').onclick = async function() {
    try{
        dialog.show(); 
        const token = localStorage.getItem('token');
        const gtoken = localStorage.getItem('gtoken');
        const response = await axios.get("http://Localhost:3000/group/get-users", { headers: {"Authorization" : token, "Gauthorization" : gtoken}});
        if(response.status === 200){
            const users = document.getElementById('users');
            users.innerHTML = ''
            response.data.AllGroupUser.forEach((element) => {
                if(userid!= element.userId){
                    users.innerHTML += `<li>${element.name}<button id='${element.userId}' onclick="removeuser(${element.userId},'${element.name}')">Remove</button></li>`
                }
            })
        }
    }catch(err) {
        console.log(err);
    }       
};

async function removeuser(id,name) {
    try{
        const useridforgrp = {
            id,
            name
        }
        const users = document.getElementById('users');
        const removeuserbutton = document.getElementById(id);
        users.removeChild(removeuserbutton.parentElement);
        const token = localStorage.getItem('token');
        const gtoken = localStorage.getItem('gtoken');
        const response = await axios.post("http://Localhost:3000/group/remove-users",useridforgrp ,{ headers: {"Authorization" : token, "Gauthorization" : gtoken}}) 
        if(response.status === 200){
            alert(response.data.message);
        }
    }catch(err) {
        console.log(err);
    }
}

document.getElementById('Allgroupuser-button').onclick = async function() {
    try{
        dialog.show(); 
        const token = localStorage.getItem('token');
        const gtoken = localStorage.getItem('gtoken');
        const response = await axios.get("http://Localhost:3000/group/get-users",{ headers: {"Authorization" : token, "Gauthorization" : gtoken}}) 
        if(response.status === 200){
            const users = document.getElementById('users');
            users.innerHTML = ''
            response.data.AllGroupUser.forEach((element) => {
                if(userid!= element.userId){
                    users.innerHTML += `<li>${element.name}</li>`
                }
            })
            
        }
    }catch(err) {
        console.log(err);
    }
}


const filter = document.getElementById('search-users');
const itemList = document.getElementById('users');
filter.addEventListener('keyup',filterItems);

function filterItems(e){
    const text = e.target.value.toLowerCase();
    const items = itemList.getElementsByTagName('li');

    Array.from(items).forEach(function(item){
        let itemName1 = item.textContent;
        if((itemName1.toLowerCase().indexOf(text) != -1))
        {
            item.style.display='block';
        }
        else{
            item.style.display='none';
        }
    })
}

document.getElementById('logout').onclick = async function (e) {
    try{
        localStorage.clear();
        window.location.href = "../login/login.html"
    }catch(err) {
        console.log(err);
    }
}