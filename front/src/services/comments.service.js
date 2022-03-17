import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetComments = (id,token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    /*const bodyParameters = {
       key: "value"
    };*/
    return axios.get(BASE_URL + 'posts/'+id+'/comments',config)
      .then((res) => res.data)
      .catch((err) => err)
}