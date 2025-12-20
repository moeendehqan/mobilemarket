import Login from "../services/login.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useLogin = (mobile: string, otp: string) => {
    const navigate = useNavigate();
    const { data, error, isPending, mutate, isSuccess, isError } = useMutation({
        mutationFn: () => Login(mobile, otp),
    });

    useEffect(() => {
        if (isError && error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage, {
                toastId: 'login-error',
            });
        }
        if (isSuccess && data) {
            const sixHours = 6 / 24;
            Cookies.set('access_token', data.access, { expires: sixHours });
            Cookies.set('refresh_token', data.refresh, { expires: sixHours });
            toast.success("موفقیت آمیز", {
                toastId: 'login-success',
            });
            navigate('/');
        }
    }, [isError, isSuccess, error, data, navigate]);

    return { data, error, isPending, mutate, isSuccess };
}

export default useLogin;
