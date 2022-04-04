import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetProfile = (userId) => {

  const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };
    console.log("User id : " + userId);
    return axios.get(BASE_URL + 'profiles/'+userId.id,options)
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
  return axios.get(BASE_URL + 'profiles/'+userId.id+'/posts',options)
    .then((res) =>{
      console.log(res.data);
      return res.data;
      })
    .catch((err) => err);
}

export const SearchProfiles = (profiles) => {

  const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };

    const bodyParameters = {
      userId : sessionStorage.getItem("userId"),
      profiles: profiles
  };

    return axios.post(BASE_URL + 'profiles/search',bodyParameters,options)
      .then((res) =>{
        return res.data;
        })
      .catch((err) => err);
}

export const TextSearchProfiles = (query) => {

  const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };

    const bodyParameters = {
      userId : sessionStorage.getItem("userId"),
      query: query
  };

    return axios.post(BASE_URL + 'profiles/textsearch',bodyParameters,options)
      .then((res) =>{
        return res.data;
        })
      .catch((err) => err);
}

export const EditProfile = (profile) => {

  const options = {
        headers: { Authorization: 'Bearer '+sessionStorage.getItem("token") }
    };

    const bodyParameters = {
      userId : sessionStorage.getItem("userId"),
      profile: profile
  };

    return axios.put(BASE_URL + 'profiles/'+profile.userId,bodyParameters,options)
      .then((res) =>{
        return res.data;
        })
      .catch((err) => err);
}