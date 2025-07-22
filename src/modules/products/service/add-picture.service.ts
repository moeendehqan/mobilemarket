import { ApiUser } from "../../../api";
import type { Picture } from "../types/picture.type";


const AddPictureService = async (picture: FormData): Promise<Picture> => {
    const headers = {
        'Content-Type': 'multipart/form-data',
    }
    const response = await ApiUser.post(`/api/store/picture/`, picture, { headers });
    return response.data;
}

export default AddPictureService;

