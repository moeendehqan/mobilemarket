import { Api } from "../../../api";



const Login = async (mobile: string, otp: string) => {
    const response = await Api.post('/api/user/login/', { mobile, otp });
    return response.data;
};

export default Login;

