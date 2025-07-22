import RegisterService from "../services/register.service";
import { useMutation } from "@tanstack/react-query";
import type { UserType } from "../types/user.type";


const useRegister = () => {
    const { mutate, isPending, error, isSuccess } = useMutation({
        mutationFn: (data: UserType) => RegisterService.register(data),
    });

    return { mutate, isPending, error, isSuccess };
}

export default useRegister;

