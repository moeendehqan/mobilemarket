import { useQuery } from "@tanstack/react-query";
import ListProductService from "../service/list-product.service";


const useProductsList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['productsList'],
        queryFn: () => ListProductService(),
    });

    return { data, isLoading, error };
}

export default useProductsList;
