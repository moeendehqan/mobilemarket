import { ApiUser } from "../../../api";
import type { StatisticType } from "../types/statistic.type";

export const getStatistic = async (): Promise<StatisticType> => {
    const response = await ApiUser.get("/api/store/statistic/");
    return response.data;
};
