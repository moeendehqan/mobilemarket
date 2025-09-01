import axios from "axios";
import {url} from './url'


const Api = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default Api;
