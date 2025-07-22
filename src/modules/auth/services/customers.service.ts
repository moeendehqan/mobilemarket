import { ApiUser } from "../../../api";



export const CustomersService = {
    getCustomers: async () => {
        const response = await ApiUser.get('api/user/information/');
        return response.data;
    }
}

export const CustomerDetailService = {
    getCustomerDetail: async (id: string) => {
        const response = await ApiUser.get(`api/user/information/${id}/`);
        return response.data;
    }
}

export const CustomerUpdateService = {
    updateCustomer: async (id: string, data: any) => {
        const response = await ApiUser.patch(`api/user/update/${id}/`, data);
        return response.data;
    }
}

