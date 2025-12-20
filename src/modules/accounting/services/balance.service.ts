import { ApiUser } from "../../../api";
import type { Balance } from "../types/balance.type";



const balanceService = async () => {
    const response = await ApiUser.get<Balance>(`/api/accounting/balance/`);
    return response.data;
  
};

export default balanceService;