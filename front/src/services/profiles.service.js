import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetProfile = () => {
    const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };

    return axios.get(BASE_URL + 'profile/',options)
      .then((res) =>{
        console.log(res.data);
        return res.data;
        })
      .catch((err) => err)
}

export const GetProfilePosts = () => {
  const options = {
      headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
  };

  return axios.get(BASE_URL + 'profile/posts',options)
    .then((res) =>{
      console.log(res.data);
      return res.data;
      })
    .catch((err) => err)
}