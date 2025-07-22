import { CustomersService } from "../services/customers.service";
import { useQuery } from "@tanstack/react-query";



const useCustomer = () => {
    const getCustomers = useQuery({
        queryKey: ['customers'],
        queryFn: () => CustomersService.getCustomers(),
    })

    return { getCustomers };
}

export default useCustomer;
