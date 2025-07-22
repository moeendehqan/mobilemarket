import { useMutation } from "@tanstack/react-query";
import AddPictureService from "../service/add-picture.service";




const useAddPicture = () => {
    const { mutateAsync, isPending ,data } = useMutation({
        mutationFn: AddPictureService,
        mutationKey: ['addPicture'],
    });
    return { mutateAsync, isPending ,data};
}

export default useAddPicture;
