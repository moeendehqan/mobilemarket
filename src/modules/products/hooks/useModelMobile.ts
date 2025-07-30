import { useQuery } from "@tanstack/react-query";
import listModelsService from "../service/list-models.service";




const useModelMobile = () => {
    return useQuery({
        queryKey: ["model-mobile"],
        queryFn: listModelsService,
    });
};

export default useModelMobile;

