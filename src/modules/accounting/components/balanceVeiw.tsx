


import React from "react";
import useGetBalance from "../hook/useGetBalance";


const BalanceView: React.FC = () => {
    const { data, isLoading } = useGetBalance();

    if (isLoading) return <div className="h-6 w-24 bg-gray-100 animate-pulse rounded" />;

    const balance = (Number(data?.bede) || 0) - (Number(data?.best) || 0);

    return (
        <span className={`font-bold text-lg ${balance > 0 ? "text-rose-600" : "text-emerald-600"}`} dir="ltr">
            {balance.toLocaleString()} ریال
        </span>
    );
};

export default BalanceView;