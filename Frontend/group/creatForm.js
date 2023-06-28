async function createGroup(event){
    event.preventDefault();
    const token = localStorage.getItem('token');
    const groupname = event.target.groupName.value;
    console.log(groupname)
    const groupDetails = {
        groupname
        }
    const response = await axios.post("http://Localhost:3000/group/create-group",groupDetails, { headers: {"Authorization" : token}});
    document.body.innerHTML += `<div style="color:green;">${response.data.message}</div>`; 
    window.location.href = "../chat/chat.html"
}