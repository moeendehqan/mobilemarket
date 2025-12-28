import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateProductService from "../service/update-product.service";
import type { Product } from "../types/product.type";

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      updateProductService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-list"] });
      queryClient.invalidateQueries({ queryKey: ["product-me"] });
    },
  });
};

export default useUpdateProduct;
