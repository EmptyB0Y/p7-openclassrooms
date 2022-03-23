import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetPosts = () => {
  const options = {
      headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
  };
  
  return axios.get(BASE_URL + 'posts',options)
      .then((res) => {return res.data;})
      .catch((err) => err)
}

export const PostPost = (text) => {
  
  const options = {
    headers:{
    Authorization: 'Bearer '+sessionStorage.getItem("token")
  }
};
const bodyParameters = {
    userId : sessionStorage.getItem("userId"),
    post: {content: text}
};
  
  return axios.post(BASE_URL + 'posts',bodyParameters,options)
      .then((res) => console.log(res.data))
      .catch((err) => err)
}