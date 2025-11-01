import type { Picture } from "./picture.type";
import type { Color } from "./color.type";
import type { UserType } from "../../auth/types/user.type";

export interface Product {
    id?: number;
    seller?: UserType | number;
    description: string;
    description_appearance: string;
    technical_problem: string;
    price: number;
    color: Color | string | number;
    picture: Picture[];
    battry_health: number;
    battry_change: boolean;
    type_product: "new" | "as new" | "used" | null;
    auction: boolean;
    guarantor: number;
    repaired: boolean;
    part_num: string | null;
    // Additional fields used in detail product page
    battry?: number | string | null;
    ram?: number | string | null;
    sim_card?: string | null;
    charger?: boolean;
    carton?: string | null;
    hit_product?: boolean;
    registered?: boolean;
    size?: string | null;
    register_date?: string | null;
    status_product: "open" | "saled" | "canseled" | "reserved" | null;
    grade: string;
    model_mobile: {
        id: number;
        picture: Picture[];
        colors: Color[];
        model_name: string;
        brand: string;
        is_apple: boolean;
        link: string | null;
        link_2: string | null;
        link_3: string | null;
        link_4: string | null;
        link_5: string | null;
        created_at: string;
        updated_at: string;
    };
    created_at: string;
    updated_at: string;
}
