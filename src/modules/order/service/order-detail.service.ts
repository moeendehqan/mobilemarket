import ApiUser from "../../../api/ApiUser";

const getOrderDetail = async (id: number) => {
    const response = await ApiUser.get(`/api/store/order/${id}`);
    return response.data;
}

export default getOrderDetail;

