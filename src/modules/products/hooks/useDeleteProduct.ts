import { useMutation } from "@tanstack/react-query";
import deleteProductService from "../service/delete-product.service";

const useDeleteProduct = () => {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteProductService,
        mutationKey: ["deleteProduct"],
    });

    return { mutateAsync, isPending };
}

export default useDeleteProduct;
