import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "../services/user.service";


const useUserUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => UserService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export default useUserUpdate;