import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetPosts = () => {
  const options = {
    body : {
      userId : sessionStorage.getItem("userId")
    },
      headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
  };
  
  return axios.get(BASE_URL + 'posts',options)
      .then((res) => {return res.data;})
      .catch((err) => err)
}