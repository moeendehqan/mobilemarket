import type { Product } from "../types/product.type";
import { ApiUser } from "../../../api";

const updateProductService = async (id: number, product: Partial<Product>) => {
    const response = await ApiUser.patch(`/api/store/product/${id}/`, product);
    return response.data;
}

export default updateProductService;
