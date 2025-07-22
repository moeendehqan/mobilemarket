import { ApiUser } from "../../../api";



const getOrderSet = async (id: number) => {
    const response = await ApiUser.post(`/api/store/order/`,{
        product: id
    });
    return response.data;
}

export default { getOrderSet };
