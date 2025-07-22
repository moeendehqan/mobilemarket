import { useQuery } from "@tanstack/react-query";
import UserService from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useUser = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: () => UserService.login(),
    });

    useEffect(() => {
        if (!isLoading && data && data.is_register === false) {
            navigate('/register');
        }
    }, [data, isLoading, navigate]);


    const permissionsCheck = (permissions: string[]) => {
        return permissions.some((permission) => data?.user_permissions?.some((p) => p.codename === permission));
    }

    return { data, isLoading, error, permissionsCheck };
};

export default useUser;
