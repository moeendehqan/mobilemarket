import { useMutation } from "@tanstack/react-query";
import OrderSetService from "../service/order-set.service";


const useOrderSet = (id: number) => {
    const { data, isPending, error, mutate } = useMutation({
        mutationFn: () => OrderSetService.getOrderSet(id)
    })

    return { data, isPending, error, mutate }
}

export default useOrderSet;
