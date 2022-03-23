import '../styles/Login.css'
import arrow from '../assets/Icons/arrow-right.webp'
import {Signup} from './Signup'
import {LoginUser} from '../services/credentials.service'

export const Login = () => {

    return (
        <div>
            <div id='login-component'>
                <h1>LOG IN :</h1>
                <form id='login-form' onSubmit={(e) => handleSubmit(e)}>
                    <p>E-mail address :</p>
                    <input name='email-input'></input>
                    <p>Password :</p>
                    <input name='password-input'></input>
                    <button name='submit'><img id='arrow-submit' src={arrow}></img></button>
                </form>
                <p>Not registered yet ? : <a href='#' onClick={handleClick}>Sign up</a></p>
            </div>
                <div id='signup-component'><Signup /></div>
        </div>
        )
}

function handleSubmit(e) {
    e.preventDefault()
    const email = e.target['email-input'].value;
    const password = e.target['password-input'].value;
    console.log(email + " : " + password);
    LoginUser(email,password).then((data) => {
        console.log("data : ");
        console.log(data);
        if(data.token){
            sessionStorage.setItem("userId",data.userId)
            sessionStorage.setItem("token",data.token)
        }
        window.location.reload();
    });
}

function handleClick(){
    let x = document.getElementById("signup-component");
    let y = document.getElementById("login-component");
    x.style.display = "block";
    y.style.display = "none";  
}