import type { PermissionType } from "./permission.type";


export type UserType = {
    id: number | undefined;
    username: string;
    uniqidentifier: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    mobile: string;
    address: string | null;
    city: string | null;
    company: string | null;
    sheba_number: string | null;
    card_number: string | null;
    account_number: string | null;
    account_bank: string | null;
    is_verified: boolean;
    admin: boolean;
    work_guarantee: boolean;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    is_register: boolean;
    user_permissions: PermissionType[] | null | undefined;
    business_license?: string | null;
    head_store_image?: string | null;
    store_window_image?: string | null;
    Warranty_check_image?: string | null;
    type_client: 'customer' | 'business' | null;

}
