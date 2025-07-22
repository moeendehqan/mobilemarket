import useStatistic from "../hooks/useStatistic";
import { 
    FiShoppingCart, 
    FiShoppingBag, 
    FiPackage, 
    FiDollarSign,
    FiTrendingUp,
    FiLoader
} from "react-icons/fi";
import { BiError } from "react-icons/bi";

const StatisticPage = () => {
    const { data, isLoading, error } = useStatistic();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2 text-blue-600">
                    <FiLoader className="animate-spin text-2xl" />
                    <span className="text-lg font-medium">در حال بارگذاری آمار...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2 text-red-600">
                    <BiError className="text-2xl" />
                    <span className="text-lg font-medium">خطا در بارگذاری آمار</span>
                </div>
            </div>
        );
    }

    const statisticCards = [
        {
            title: "سفارشات فروشنده",
            value: data?.orders_seller || 0,
            icon: FiShoppingCart,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "سفارشات خریدار",
            value: data?.orders_buyer || 0,
            icon: FiShoppingBag,
            color: "bg-gradient-to-r from-green-500 to-green-600",
            textColor: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "تعداد محصولات",
            value: data?.products || 0,
            icon: FiPackage,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
            textColor: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "درآمد فروشنده",
            value: data?.total_price_seller ? `${data.total_price_seller.toLocaleString()} تومان` : "0 تومان",
            icon: FiDollarSign,
            color: "bg-gradient-to-r from-orange-500 to-orange-600",
            textColor: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: "هزینه خریدار",
            value: data?.total_price_buyer ? `${data.total_price_buyer.toLocaleString()} تومان` : "0 تومان",
            icon: FiTrendingUp,
            color: "bg-gradient-to-r from-red-500 to-red-600",
            textColor: "text-red-600",
            bgColor: "bg-red-50"
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">آمار و گزارشات</h1>
                <p className="text-gray-600">نمای کلی از عملکرد فروشگاه شما</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {statisticCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Card Header with Gradient */}
                            <div className={`${card.color} p-4`}>
                                <div className="flex items-center justify-between">
                                    <IconComponent className="text-white text-2xl" />
                                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                                        <IconComponent className="text-white text-lg" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className={`text-2xl font-bold ${card.textColor}`}>
                                        {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                            <FiDollarSign className="text-green-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">خلاصه درآمد</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">کل درآمد فروشنده:</span>
                            <span className="font-semibold text-green-600">
                                {data?.total_price_seller ? `${data.total_price_seller.toLocaleString()} تومان` : "0 تومان"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">کل هزینه خریدار:</span>
                            <span className="font-semibold text-red-600">
                                {data?.total_price_buyer ? `${data.total_price_buyer.toLocaleString()} تومان` : "0 تومان"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Orders Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <FiShoppingCart className="text-blue-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">خلاصه سفارشات</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">سفارشات فروشنده:</span>
                            <span className="font-semibold text-blue-600">
                                {data?.orders_seller || 0} سفارش
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">سفارشات خریدار:</span>
                            <span className="font-semibold text-green-600">
                                {data?.orders_buyer || 0} سفارش
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">کل محصولات:</span>
                            <span className="font-semibold text-purple-600">
                                {data?.products || 0} محصول
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticPage;


