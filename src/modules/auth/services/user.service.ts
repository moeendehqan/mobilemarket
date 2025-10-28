import { ApiUser } from "../../../api";
import type { UserType } from "../types/user.type";



const UserService = {
    login: async (): Promise<UserType> => {
        const response = await ApiUser.get('api/user/profile/');
        return response.data;
    },
    updateProfile: async (data: FormData): Promise<UserType> => {
        const response = await ApiUser.patch('api/user/profile/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}


export default UserService;
