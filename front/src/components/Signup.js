import '../styles/Login.css'
import arrow from '../assets/Icons/arrow-right.webp'
import {SignupUser} from '../services/credentials.service'

export const Signup = () => {

    return (
        <div>
            <h1>SIGN UP :</h1>
            <form id='login-form' onSubmit={(e) => handleSubmit(e)}>
                
                <p>E-mail address :</p>
                <input name='email-input'></input>
                <p>Password :</p>
                <input name='password-input'></input>
                <p>Confirm password :</p>
                <input name='password-confirm-input'></input>
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

    if(password !== passwordConfirm){
        alert("Passwords do not match");
        return;
    }

    SignupUser(email,password).then((data) => {
        if(data.token){
            sessionStorage.setItem("userId",data.userId)
            sessionStorage.setItem("token",data.token)
        }
        window.location.reload();
    });
}

function handleClick(){
    let x = document.getElementById("login-component");
    let y = document.getElementById("signup-component");
    x.style.display = "block";
    y.style.display = "none";  }