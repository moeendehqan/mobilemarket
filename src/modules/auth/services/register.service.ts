import { ApiUser } from "../../../api";
import type { UserType } from "../types/user.type";


const RegisterService = {
    register: async (data: UserType) => {
        const response = await ApiUser.post('/api/user/register/', data);
        return response.data;
    }
}

export default RegisterService;
