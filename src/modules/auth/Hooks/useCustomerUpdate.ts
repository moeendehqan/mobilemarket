import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CustomerUpdateService } from "../services/customers.service"




const useCustomerUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => CustomerUpdateService.updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
        }
    })

}


export default useCustomerUpdate;
