import '../styles/Login.css'
import arrow from '../assets/Icons/arrow-right.webp'
import {SignupUser} from '../services/credentials.service'

export const Signup = () => {

    return (
        <div>
            <h1>SIGN UP :</h1>
            <form id='signup-form' onSubmit={(e) => handleSubmit(e)}>
                
                <p>* E-mail address :</p>
                <input name='email-input'></input>
                <p className='form-error' id='email-error'>Invalid format !</p>
                <p>* Password :</p>
                <input name='password-input' type='password'></input>
                <p className='form-error' id='password-error'>Password must be 8 characters long and contain at least: 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character</p>
                <p>* Confirm password :</p>
                <input name='password-confirm-input' type='password'></input>
                <p className='form-error' id='password-confirm-error'>Passwords do not match !</p>
                <p>* First name :</p>
                <input name='firstname-input'></input>
                <p className='form-error' id='firstname-error'>You must enter a name !</p>
                <p>Last name</p>
                <input name='lastname-input'></input>
                <p>A short description of you</p>
                <input name='description-input'></input>
                <button name='submit'><img id='arrow-submit' src={arrow}></img></button>
            </form>
            <p>Have an account ? : <a href='#' onClick={handleClick}>Log in</a></p>
        </div>
        )
}

function handleSubmit(e) {
    e.preventDefault()
    const email = e.target['email-input'].value;
    const password = e.target['password-input'].value;
    const passwordConfirm = e.target['password-confirm-input'].value;
    const firstname = e.target['firstname-input'].value;
    const lastname = e.target['lastname-input'].value;
    const description = e.target['description-input'].value;

    const emailValid = /^[A-Za-z0-9_-]+@\w+\.[a-z]+$/;
    const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    //(?=.*[a-z]) : The string must contain at least 1 lowercase alphabetical character
    //(?=.*[A-Z]) : The string must contain at least 1 uppercase alphabetical character
    //(?=.*[0-9]) : The string must contain at least 1 numeric character
    //(?=.*[!@#$%^&*]) : The string must contain at least one special character, but we are escaping reserved regex characters to avoid conflict
    //(?=.{8,})	The string must be eight characters or longer
    let pass = true;
    if(!emailValid.test(email)){
        document.getElementById("email-error").style.display = "block";
        pass = false;
    }
    else{
        document.getElementById("email-error").style.display = "none";
    }
    if(!passwordStrong.test(password)){
        document.getElementById("password-error").style.display = "block";
        pass = false;
    }
    else{
        document.getElementById("password-error").style.display = "none";
    }
    if(password !== passwordConfirm){
        document.getElementById("password-confirm-error").style.display = "block";
        pass = false;
    }
    else{
        document.getElementById("password-confirm-error").style.display = "none";
    }
    if(firstname === ""){
        document.getElementById("firstname-error").style.display = "block";
        pass = false;
    }
    else{
        document.getElementById("firstname-error").style.display = "none";
    }
    if(pass){
        SignupUser(email,password,firstname,lastname,description).then((data) => {
            window.location.reload();
        });
    }    
}

function handleClick(){
    let x = document.getElementById("login-component");
    let y = document.getElementById("signup-component");
    x.style.display = "block";
    y.style.display = "none";  
}