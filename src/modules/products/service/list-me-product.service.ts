import ApiUser from "../../../api/ApiUser";
import type { Product } from "../types/product.type";

const ListMeProductService = async (): Promise<Product[]> => {
    const response = await ApiUser.get(`/api/store/product/?self_product=true`);
    return response.data;
}

export default ListMeProductService;

