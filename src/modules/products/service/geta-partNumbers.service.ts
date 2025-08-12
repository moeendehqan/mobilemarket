import type { PartNumber } from "../types/partNamber.type";
import { ApiUser } from "../../../api";



export const getPartNumbers = async (): Promise<PartNumber[]> => {
    const response = await ApiUser.get<PartNumber[]>('/api/store/pardnumber');
    return response.data;
}





