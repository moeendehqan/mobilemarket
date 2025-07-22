import axios from "axios";


const Api = axios.create({
    baseURL: 'https://api.shikala.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default Api;
