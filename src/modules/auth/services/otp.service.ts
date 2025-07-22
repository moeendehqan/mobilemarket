
import { Api } from '../../../api';


const SendOtp = async (mobile: string) => {
    const response = await Api.post('/api/user/otp/', { mobile });
    return response.data;
};

export default SendOtp;



