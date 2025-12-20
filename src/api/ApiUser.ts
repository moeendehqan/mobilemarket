import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import {url} from './url'

const ApiUser = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

ApiUser.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        toast.error('خطا در ارسال درخواست');
        return Promise.reject(error);
    }
);

ApiUser.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('refresh_token');
                if (!refreshToken) {
                    toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await axios.post('https://api.shikala.com/api/user/refresh/', {
                    refresh: refreshToken
                });

                const { access_token } = response.data;
                
                // تنظیم کوکی‌ها برای انقضا پس از 6 ساعت
                const sixHours = 6 / 24;
                Cookies.set('access_token', access_token, { expires: sixHours });
                
                // تمدید زمان انقضای رفرش توکن (Sliding Session)
                if (refreshToken) {
                    Cookies.set('refresh_token', refreshToken, { expires: sixHours });
                }

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return axios(originalRequest);

            } catch (refreshError) {
                toast.error('تمدید نشست با خطا مواجه شد. لطفاً دوباره وارد شوید.');
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        const errorMessage =
            error.response?.data?.message ||  // پیام اختصاصی سرور
            error.response?.data?.detail ||   // در صورتی که از DRF استفاده شده
            error.message || 'خطایی رخ داده است.';
        
        toast.error(errorMessage);

        return Promise.reject(error);
    }
);

export default ApiUser;
