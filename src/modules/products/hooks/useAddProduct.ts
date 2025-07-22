import { useMutation } from "@tanstack/react-query";
import addProductService from "../service/add-product.service";
import { useNavigate } from "react-router-dom";

const useAddProduct = () => {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: addProductService,
        mutationKey: ["addProduct"],
        onSuccess: () => {
            navigate("/products");
        }
    });

    return { mutateAsync, isPending };
}

export default useAddProduct;
