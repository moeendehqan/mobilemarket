import { useQuery } from "@tanstack/react-query";
import { CustomerDetailService } from "../services/customers.service";

const useCustomerDetail = (id: string) => {
  return useQuery({
    queryKey: ['customerDetail', id],
    queryFn: () => CustomerDetailService.getCustomerDetail(id),
    enabled: !!id,
  });
};

export default useCustomerDetail;
