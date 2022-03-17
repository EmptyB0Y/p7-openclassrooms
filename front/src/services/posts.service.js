import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"

export const GetPosts = () => {
    return axios.get(BASE_URL + 'posts')
      .then((res) => res.data)
      .catch((err) => err)
}