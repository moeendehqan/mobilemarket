import { ApiUser } from "../../../api";


const getOrderList = async () => {
    const response = await ApiUser.get('/api/store/order/');
    return response.data;
}

export default { getOrderList };
