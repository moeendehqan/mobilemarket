import ApiUser from "../../../api/ApiUser";
import type { Product } from "../types/product.type";

const ListProductService = async (): Promise<Product[]> => {
    const response = await ApiUser.get(`/api/store/product/`);
    return response.data;
}

export default ListProductService;

