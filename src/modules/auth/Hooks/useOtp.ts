import { useMutation } from "@tanstack/react-query";
import SendOtp from "../services/otp.service";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AxiosError } from "axios";

const useOtp = (mobile: string) => {
    const { data, error, isPending, mutate, isSuccess, isError } = useMutation({
        mutationFn: () => SendOtp(mobile),
    });

    useEffect(() => {
        if (isError && error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage, {
                toastId: 'otp-error',
            });
        }
        if (isSuccess) {
            toast.success("کد ارسال شد", {
                toastId: 'otp-success',
            });
        }
    }, [isError, isSuccess, error]);

    return { data, error, isPending, mutate, isSuccess };
}

export default useOtp;
