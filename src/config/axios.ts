import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";

// กำหนด baseURL ของ axios จาก environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// ตั้งค่า interceptor สำหรับการส่ง request
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }
            config.headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ตั้งค่า interceptor สำหรับการรับ response
axios.interceptors.response.use(
    (response: AxiosResponse) => Promise.resolve(response),
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
        }
        return Promise.reject(error);
    }
);

export default axios;
