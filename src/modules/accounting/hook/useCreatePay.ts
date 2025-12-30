import { useMutation } from "@tanstack/react-query";
import createPayService from "../services/create_pay.service";



const useCreatePay = () => {
    return useMutation<string, Error, number>({
        mutationKey: ["create-pay"],
        mutationFn: createPayService,
    });
}

export default useCreatePay;
