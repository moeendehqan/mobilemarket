import { ApiUser } from "../../../api";


interface NewCamera {
    name: string;
    resolution: string;
    description: string;
  }

const AddCameraService = async (camera: NewCamera) => {
    const response = await ApiUser.post(`/api/store/camera/`, camera);
    return response.data;
}

export default AddCameraService;

