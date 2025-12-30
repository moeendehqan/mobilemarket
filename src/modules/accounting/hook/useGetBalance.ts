import { useQuery } from "@tanstack/react-query";
import balanceService from "../services/balance.service";
import type { Balance } from "../types/balance.type";



const useGetBalance = () => {
    return useQuery<Balance>({
        queryKey: ["balance"],
        queryFn: balanceService,
    });
}

export default useGetBalance;
