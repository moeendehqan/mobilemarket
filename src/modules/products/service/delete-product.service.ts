import type { Product } from "../types/product.type";
import { ApiUser } from "../../../api";



const deleteProductService = async (product: Product) => {
    const response = await ApiUser.delete(`/api/store/product/${product.id}/`);
    return response.data;
}

export default deleteProductService;
