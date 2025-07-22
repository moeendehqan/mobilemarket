import { useQuery } from "@tanstack/react-query"
import OrderListService from "../service/order-list.service"



const useOrderList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['orderList'],
        queryFn: () => OrderListService.getOrderList()
    })

    return { data, isLoading, error }
}

export default useOrderList;
