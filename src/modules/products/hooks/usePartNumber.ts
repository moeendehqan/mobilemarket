import { useQuery } from "@tanstack/react-query";
import { getPartNumbers } from "../service/geta-partNumbers.service";
import type { PartNumber } from "../types/partNamber.type";


export const usePartNumber = () => {
    return useQuery<PartNumber[]>({
        queryKey: ['part-numbers'],
        queryFn: getPartNumbers,
    });
    
}


