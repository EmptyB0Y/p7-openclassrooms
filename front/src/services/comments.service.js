import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetComments = (postId) => {
    const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };
    console.log(postId.id);
    return axios.get(BASE_URL + 'posts/'+postId.id+'/comments',options)
      .then((res) => res.data)
      .catch((err) => err)
}

export const PostComment = (postId,comment) =>{
    const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };
    const bodyParameters = {
        userId : sessionStorage.getItem("userId"),
        comment: comment
    };

    if(comment.length > 0){
        return axios.post(BASE_URL + 'posts/'+postId+'/comments',bodyParameters,options)
        .then((res) => console.log(res.data))
        .catch((err) => err)
    }
}

export const GetAuthorProfile = (userId) =>{
    const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };

    return axios.get(BASE_URL + 'profile/'+userId,options)
      .then((res) => res.data)
      .catch((err) => err)
}