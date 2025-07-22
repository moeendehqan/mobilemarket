import { useQuery } from "@tanstack/react-query"
import getOrderDetail from "../service/order-detail.service"



export const useOrderDetail = (id: number) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['orderDetail', id],
        queryFn: () => getOrderDetail(id)
    })

    return { data, isLoading, error }
}
    
