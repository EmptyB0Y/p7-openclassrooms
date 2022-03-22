import '../styles/Login.css'
import arrow from '../assets/Icons/arrow-right.webp'
import {LoginUser} from '../services/credentials.service'

export const Login = () => {

    return (
        <div>
            <h1>LOGIN :</h1>
            <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
                <input name='email-input'></input>
                <input name='password-input'></input>
                <button name='submit'><img id='arrow-submit' src={arrow}></img></button>
            </form>
            <p>Not registered yet ? : <a href='#'>Register</a></p>
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