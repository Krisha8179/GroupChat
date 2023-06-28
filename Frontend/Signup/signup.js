async function signup(event){
        try{
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const phone_number = event.target.phone_number.value;
        const password = event.target.password.value;
        const signupDetails = {
            name,
            email,
            phone_number,
            password
            }
        const response = await axios.post("http://Localhost:3000/user/signup",signupDetails) 
        if(response.status=== 201){
            alert('user registered successfully')
            window.location.href = "../login/login.html"
        } 
        }catch(error)
        {
           document.body.innerHTML += `<div style="color:red;">${error}</div>`; 
        }
        
    }