async function forgotPassword(event){
    try{
    event.preventDefault();
    const Email = event.target.Email.value;
    const userDetails = {
        Email
    }
    const response = await axios.post("http://Localhost:3000/password/forgotpassword", userDetails)
    if(response.status === 200){
        document.body.innerHTML += '<div style="color:red;">Mail Successfully sent <div>'

    }
    }catch(err){
        console.log(err);
    }
}
