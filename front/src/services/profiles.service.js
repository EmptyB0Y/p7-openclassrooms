import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetProfile = (userId) => {

  const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };

    return axios.get(BASE_URL + 'profile/'+userId,options)
      .then((res) =>{
        console.log(res.data);
        return res.data;
        })
      .catch((err) => err);
}

export const GetProfilePosts = (userId) => {

  const options = {
      headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
  };
  console.log(userId.id);
  return axios.get(BASE_URL + 'profile/'+userId.id+'/posts',options)
    .then((res) =>{
      console.log(res.data);
      return res.data;
      })
    .catch((err) => err);
}