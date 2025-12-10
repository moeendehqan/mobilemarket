import type { Product } from "../types/product.type";
import { ApiUser } from "../../../api";



// سرویس: add-product.service

const addProductService = async (product: Product) => {
    const response = await ApiUser.post(`/api/store/product/`, product);
    return response.data;
}

export default addProductService;