import { useQuery } from "@tanstack/react-query";
import DetailProductService from "../service/detail-product.service";


const useDetailProduct = (id: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['detailProduct', id],
        queryFn: () => DetailProductService(id),
        enabled: !!id,
    });

    return { data, isLoading, error };
}


export default useDetailProduct;
