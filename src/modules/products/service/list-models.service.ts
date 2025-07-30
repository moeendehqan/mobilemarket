
import type { modelMobileType } from "../types/modelmobile.type";
import { ApiUser } from "../../../api";



const listModelsService = async (): Promise<modelMobileType[]> => {
    const response = await ApiUser.get<modelMobileType[]>("/api/store/modelmobile/");
    return response.data;
};

export default listModelsService;

