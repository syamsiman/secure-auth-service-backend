import axios from 'axios';
import { getAccessToken } from './auth';

const Api = axios.create({
    baseURL: 'http://localhost:3000',
})

Api.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}, err => Promise.reject(err))

export default Api;