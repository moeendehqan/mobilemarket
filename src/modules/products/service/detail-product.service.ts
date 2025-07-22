import ApiUser from "../../../api/ApiUser";
import type { Product } from "../types/product.type";


const DetailProductService = async (id: string): Promise<Product> => {
    const response = await ApiUser.get(`/api/store/product/${id}/`);
    return response.data;
}

export default DetailProductService;
