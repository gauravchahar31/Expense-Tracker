function resetUser(myform, event){
    try{
        event.preventDefault();
        if(!checkEmail(myform.userEmail)){
            return false;
        }
        checkUser(myform.userEmail);
    }
    catch(err){
        console.error(err);
    }
}

async function checkUser(input){
    const user = await axios.post('/user/checkUser', {
        userEmail : input.value
    });
    if(user.data != true){
        showError(input, `Account Doesn't Exists`);
    }
    else{
        const sendResetLink = await axios.post('/user/forgotPassword', {
            userEmail : input.value
        });
        if(sendResetLink == true){
            document.querySelector('.formMessage').innerHTML = 'Password reset link sent to your email id';
        }else{
            document.querySelector('.formMessage').innerHTML = 'Somethign went wrong, Try Again!';
        }
    }
}

function checkEmail(input) {
    try{
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(input.value.trim())) {
            showSuccess(input);
            return true;
        }else {
        showError(input, 'Email is Invalid');
            return false;
        }
    }
    catch(err){
        console.error(err);
    }
}

function showError(input, message) {
    try{
        input.parentElement.className = 'form-outline flex-fill mb-0 form-control error';
        document.querySelector('.formMessage').innerHTML = message;
    }
    catch(err){
        console.error(err);
    }
}

function showSuccess(input){
    try{
        input.parentElement.className = 'form-outline flex-fill mb-0 form-control success';
        document.querySelector('.formMessage').innerHTML = '';
    }
    catch(err){
        console.error(err);
    }
}