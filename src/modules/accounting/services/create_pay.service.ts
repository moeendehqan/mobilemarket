import { ApiUser } from "../../../api";



const CreatePayService = async (amount: number) => {
    const response = await ApiUser.post<string>(`/api/accounting/create/`, {
        amount,
    });
    return response.data;
  
};

export default CreatePayService;
