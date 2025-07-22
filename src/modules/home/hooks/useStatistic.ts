import { getStatistic } from "../service/statistic.service";
import { useQuery } from "@tanstack/react-query";



const useStatistic = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["statistic"],
        queryFn: getStatistic,
    });

    return { data, isLoading, error };
};

export default useStatistic;

