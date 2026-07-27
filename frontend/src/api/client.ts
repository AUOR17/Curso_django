import axios from 'axios';

export const apiDjango = axios.create({
    baseURL: 'http://localhost:8090/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});