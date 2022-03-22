import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/auth/"

export const LoginUser = (email,password) =>{
    const bodyParameters = {
        email : email,
        password : password
        };
    
    return axios.post(BASE_URL + 'login/',bodyParameters)
      .then((res) => {return res.data;})
      .catch((err) => err)
}

export const SignupUser = (email,password,superPassword) =>{

    const bodyParameters = {
        email : email,
        password : password
        };

    if(typeof superPassword !== undefined){
        bodyParameters.superPassword = superPassword;
    }

    return axios.post(BASE_URL + 'signup/',bodyParameters)
      .then((res) => res.data)
      .catch((err) => err)
}