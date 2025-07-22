import type { Product } from "../../products/types/product.type";
import type { UserType } from "../../auth/types/user.type";

export type OrderType = {
    id?: number;
    product: Product;
    product_id?: number;
    buyer?: UserType;
    buyer_id?: number;
    seller?: UserType;
    seller_id?: number;
    sell_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

