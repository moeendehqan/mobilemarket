

import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "../hooks/useOrderDetail";
import useUser from "../../auth/Hooks/useUser";
import { BiArrowBack, BiCalendar, BiPackage, BiMoney, BiCheck } from "react-icons/bi";

const formatPrice = (price: string | number | null) => {
  if (!price) return "";
  const numPrice = typeof price === 'string' ? parseInt(price) : price;
  return new Intl.NumberFormat('fa-IR').format(numPrice) + " تومان";
};

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('fa-IR');
};

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { text: string; class: string }> = {
    pending: { text: "در انتظار", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    confirmed: { text: "تایید شده", class: "bg-green-100 text-green-800 border-green-200" },
    delivered: { text: "تحویل داده شده", class: "bg-blue-100 text-blue-800 border-blue-200" },
    cancelled: { text: "لغو شده", class: "bg-red-100 text-red-800 border-red-200" },
    ordering: { text: "در حال سفارش", class: "bg-orange-100 text-orange-800 border-orange-200" },
  };
  return statusMap[status] || { text: status || "-", class: "bg-gray-100 text-gray-800 border-gray-200" };
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading, error } = useOrderDetail(Number(id));
    const { data: currentUser } = useUser();
    
    const isReceivedOrder = order && currentUser && order.seller?.id === currentUser.id;
    const orderType = isReceivedOrder ? 'دریافتی' : 'ارسالی';
    const statusInfo = order ? getStatusInfo(order.status) : null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">خطا در بارگذاری اطلاعات سفارش</div>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        بازگشت به لیست سفارشات
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">سفارش یافت نشد</div>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        بازگشت به لیست سفارشات
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/orders')}
                    className="flex items-center text-blue-500 hover:text-blue-700 ml-4"
                >
                    <BiArrowBack className="ml-2" />
                    بازگشت
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    جزئیات سفارش #{order.id || id}
                </h1>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات سفارش</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <BiPackage className="text-blue-500 ml-3" />
                            <span className="text-gray-600">شماره سفارش:</span>
                            <span className="font-medium mr-2">#{order.id || id}</span>
                        </div>
                        
                        <div className="flex items-center">
                            <BiCalendar className="text-green-500 ml-3" />
                            <span className="text-gray-600">تاریخ ثبت:</span>
                            <span className="font-medium mr-2">{formatDate(order.created_at)}</span>
                        </div>
                        
                        <div className="flex items-center">
                            <BiCalendar className="text-purple-500 ml-3" />
                            <span className="text-gray-600">تاریخ فروش:</span>
                            <span className="font-medium mr-2">{formatDate(order.sell_date)}</span>
                        </div>
                        
                        <div className="flex items-center">
                            <BiMoney className="text-green-500 ml-3" />
                            <span className="text-gray-600">قیمت محصول:</span>
                            <span className="font-bold text-green-600 mr-2">{formatPrice(order.product?.price)}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ml-3 ${isReceivedOrder ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                            <span className="text-gray-600">نوع سفارش:</span>
                            <span className={`font-medium mr-2 ${isReceivedOrder ? 'text-blue-600' : 'text-orange-600'}`}>
                                {orderType}
                            </span>
                        </div>
                        
                        {statusInfo && (
                            <div className="flex items-center">
                                <span className="text-gray-600 ml-3">وضعیت سفارش:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.class}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                        )}
                        
                        {/* دکمه تایید سفارش برای سفارشات دریافتی */}
                        {isReceivedOrder && order.status === 'ordering' && (
                            <div className="mt-4">
                                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                                    <BiCheck className="text-xl" />
                                    تایید سفارش
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            {/* Product Information */}
            {order.product && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات محصول</h2>
                    
                    <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Product Image */}
                            <div className="flex justify-center lg:justify-start">
                                {order.product.picture?.file ? (
                                    <img 
                                        src={order.product.picture.file} 
                                        alt={order.product.model_mobile?.model_name || 'محصول'}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <BiPackage className="text-gray-400 text-3xl" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="lg:col-span-2">
                                <h3 className="font-semibold text-xl text-gray-800 mb-3">
                                    {order.product.model_mobile?.model_name || 'نام محصول نامشخص'}
                                </h3>
                                
                                {order.product.description && (
                                    <div className="mb-3">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>توضیحات:</strong> {order.product.description}
                                        </p>
                                    </div>
                                )}
                                
                                {order.product.description_appearance && (
                                    <div className="mb-3">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>ظاهر:</strong> {order.product.description_appearance}
                                        </p>
                                    </div>
                                )}
                                
                                {order.product.technical_problem && (
                                    <div className="mb-3">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>مشکلات فنی:</strong> {order.product.technical_problem}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {order.product.model_mobile?.brand && (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            برند: {order.product.model_mobile.brand}
                                        </span>
                                    )}
                                    {order.product.type_product && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            وضعیت: {order.product.type_product === 'new' ? 'نو' : order.product.type_product === 'as new' ? 'در حد نو' : 'دست دوم'}
                                        </span>
                                    )}
                                    {order.product.battry_health && (
                                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                            سلامت باتری: {order.product.battry_health}%
                                        </span>
                                    )}
                                    {order.product.carton && (
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            جعبه: {order.product.carton === 'orginal' ? 'اصلی' : 'بازبسته بندی'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Price and Status Information */}
                            <div className="text-center lg:text-right">
                                <div className="mb-3">
                                    <span className="text-gray-600 text-sm block">قیمت محصول:</span>
                                    <div className="font-bold text-2xl text-green-600">
                                        {formatPrice(order.product.price)}
                                    </div>
                                </div>
                                
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span>باتری تعویض شده:</span>
                                        <span className={order.product.battry_change ? 'text-red-600' : 'text-green-600'}>
                                            {order.product.battry_change ? 'بله' : 'خیر'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>تعمیر شده:</span>
                                        <span className={order.product.repaired ? 'text-red-600' : 'text-green-600'}>
                                            {order.product.repaired ? 'بله' : 'خیر'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>گارانتی:</span>
                                        <span>{order.product.guarantor} ماه</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default OrderDetailPage;
