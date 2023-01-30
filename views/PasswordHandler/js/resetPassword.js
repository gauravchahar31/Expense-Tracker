function resetPassword(myform, event){
    try{
        event.preventDefault();
        if(!checkLengthPass(myform.userPassword)){
            return false;
        }
        if(!checkPasswordMatch(myform.userPassword, myform.userPasswordRepeat)){
            return false;
        }
        chnagePassword(myform.userPassword);
    }
    catch(err){
        console.error(err);
    }
}

async function chnagePassword(input){
    try{
        const changePassword = await axios.post('/user/resetPassword', {
            newPassword : input.value
        });
        if(changePassword.data){
            document.querySelector('.formMessage').innerHTML = 'Password Changed Successfully, Please Login';
        }
        else{
            document.querySelector('.formMessage').innerHTML = 'Something went Wrong! Try Again';
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

function checkLengthPass(input) {
    try{
        if(input.value.length < 6) {
            showError(input, `Password must be at least 6 characters`);
            return false;
        }else if(input.value.length > 15) {
            showError(input, `Password must be les than 15 characters`);
            return false;
        }else{
            showSuccess(input);
            return true;
        }
    }
    catch(err){
        console.error(err);
    }
}

function checkPasswordMatch(input1, input2) {
    try{
        if(input1.value !== input2.value) {
            showError(input2, 'Passwords do not match');
            return false;
        }else{
            showSuccess(input2);
            return true;
        }
    }
    catch(err){
        console.error(err);
    }
}