import { useMutation } from "@tanstack/react-query";
import AddCameraService from "../service/add-camera.service";



const useAddCamera = () => {
    const { mutateAsync, isPending, data } = useMutation({
        mutationFn: AddCameraService,
        mutationKey: ['addCamera'],
    });
    return { mutateAsync, isPending, data };
}

export default useAddCamera;
