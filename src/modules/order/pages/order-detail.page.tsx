

import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "../hooks/useOrderDetail";
import { BiArrowBack, BiCalendar, BiUser, BiPhone, BiMapPin, BiPackage, BiMoney } from "react-icons/bi";

const formatPrice = (price: string | number | null) => {
  if (!price) return "";
  const numPrice = typeof price === 'string' ? parseInt(price) : price;
  return new Intl.NumberFormat('fa-IR').format(numPrice) + " تومان";
};

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('fa-IR');
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading, error } = useOrderDetail(Number(id));

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات سفارش</h2>
                    
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <BiPackage className="text-blue-500 ml-3" />
                            <span className="text-gray-600">شماره سفارش:</span>
                            <span className="font-medium mr-2">#{order.id || id}</span>
                        </div>
                        
                        {order.created_at && (
                            <div className="flex items-center">
                                <BiCalendar className="text-green-500 ml-3" />
                                <span className="text-gray-600">تاریخ ثبت:</span>
                                <span className="font-medium mr-2">{formatDate(order.created_at)}</span>
                            </div>
                        )}
                        
                        {order.status && (
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-yellow-500 ml-3"></div>
                                <span className="text-gray-600">وضعیت:</span>
                                <span className="font-medium mr-2">{order.status}</span>
                            </div>
                        )}
                        
                        {order.total_amount && (
                            <div className="flex items-center">
                                <BiMoney className="text-green-500 ml-3" />
                                <span className="text-gray-600">مبلغ کل:</span>
                                <span className="font-bold text-green-600 mr-2">{formatPrice(order.total_amount)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات مشتری</h2>
                    
                    <div className="space-y-3">
                        {order.customer_name && (
                            <div className="flex items-center">
                                <BiUser className="text-blue-500 ml-3" />
                                <span className="text-gray-600">نام:</span>
                                <span className="font-medium mr-2">{order.customer_name}</span>
                            </div>
                        )}
                        
                        {order.customer_phone && (
                            <div className="flex items-center">
                                <BiPhone className="text-green-500 ml-3" />
                                <span className="text-gray-600">تلفن:</span>
                                <span className="font-medium mr-2">{order.customer_phone}</span>
                            </div>
                        )}
                        
                        {order.customer_address && (
                            <div className="flex items-start">
                                <BiMapPin className="text-red-500 ml-3 mt-1" />
                                <span className="text-gray-600">آدرس:</span>
                                <span className="font-medium mr-2 leading-relaxed">{order.customer_address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buyer Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات خریدار</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">اطلاعات شخصی</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <BiUser className="text-blue-500 ml-3" />
                                <span className="text-gray-600">نام کاربری:</span>
                                <span className="font-medium mr-2">{order.buyer?.username || 'نامشخص'}</span>
                            </div>
                            
                            <div className="flex items-center">
                                <BiUser className="text-green-500 ml-3" />
                                <span className="text-gray-600">نام:</span>
                                <span className="font-medium mr-2">
                                    {order.buyer?.first_name && order.buyer?.last_name 
                                        ? `${order.buyer.first_name} ${order.buyer.last_name}` 
                                        : order.buyer?.first_name || order.buyer?.last_name || 'نامشخص'
                                    }
                                </span>
                            </div>
                            
                            <div className="flex items-center">
                                <BiPhone className="text-blue-500 ml-3" />
                                <span className="text-gray-600">موبایل:</span>
                                <span className="font-medium mr-2">{order.buyer?.mobile || 'نامشخص'}</span>
                            </div>
                            
                            {order.buyer?.email && (
                                <div className="flex items-center">
                                    <BiUser className="text-purple-500 ml-3" />
                                    <span className="text-gray-600">ایمیل:</span>
                                    <span className="font-medium mr-2">{order.buyer.email}</span>
                                </div>
                            )}
                            
                            {order.buyer?.company && (
                                <div className="flex items-center">
                                    <BiPackage className="text-orange-500 ml-3" />
                                    <span className="text-gray-600">شرکت:</span>
                                    <span className="font-medium mr-2">{order.buyer.company}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">آدرس و اطلاعات تماس</h3>
                        <div className="space-y-3">
                            {order.buyer?.address && (
                                <div className="flex items-start">
                                    <BiMapPin className="text-red-500 ml-3 mt-1" />
                                    <div>
                                        <span className="text-gray-600">آدرس:</span>
                                        <p className="font-medium mr-2 leading-relaxed">{order.buyer.address}</p>
                                    </div>
                                </div>
                            )}
                            
                            {order.buyer?.city && (
                                <div className="flex items-center">
                                    <BiMapPin className="text-green-500 ml-3" />
                                    <span className="text-gray-600">شهر:</span>
                                    <span className="font-medium mr-2">{order.buyer.city}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ml-3 ${order.buyer?.is_verified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-gray-600">وضعیت تایید:</span>
                                <span className={`font-medium mr-2 ${order.buyer?.is_verified ? 'text-green-600' : 'text-red-600'}`}>
                                    {order.buyer?.is_verified ? 'تایید شده' : 'تایید نشده'}
                                </span>
                            </div>
                            
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ml-3 ${order.buyer?.is_active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-600">وضعیت فعالیت:</span>
                                <span className={`font-medium mr-2 ${order.buyer?.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                                    {order.buyer?.is_active ? 'فعال' : 'غیرفعال'}
                                </span>
                            </div>
                        </div>
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
                                {order.product.image ? (
                                    <img 
                                        src={order.product.image} 
                                        alt={order.product.name}
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
                                    {order.product.name || 'نام محصول نامشخص'}
                                </h3>
                                
                                {order.product.description && (
                                    <p className="text-gray-600 mb-3 leading-relaxed">
                                        {order.product.description}
                                    </p>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                    {order.product.brand && (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            برند: {order.product.brand}
                                        </span>
                                    )}
                                    {order.product.model && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            مدل: {order.product.model}
                                        </span>
                                    )}
                                    {order.product.color && (
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            رنگ: {order.product.color}
                                        </span>
                                    )}
                                    {order.product.storage && (
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                            حافظه: {order.product.storage}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Price Information */}
                            <div className="text-center lg:text-right">
                                <div className="mb-3">
                                    <span className="text-gray-600 text-sm block">قیمت محصول:</span>
                                    <div className="font-bold text-2xl text-green-600">
                                        {formatPrice(order.product.price)}
                                    </div>
                                </div>
                                
                                {order.product.discount_percentage && (
                                    <div className="mb-3">
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                            تخفیف: {order.product.discount_percentage}%
                                        </span>
                                    </div>
                                )}
                                
                                <div className="text-sm text-gray-500">
                                    <div>موجودی: {order.product.stock || 'نامشخص'}</div>
                                    {order.product.warranty && (
                                        <div className="mt-1">گارانتی: {order.product.warranty}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Notes */}
            {order.notes && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">یادداشت‌ها</h2>
                    <p className="text-gray-700 leading-relaxed">{order.notes}</p>
                </div>
            )}
        </div>
    );
};

export default OrderDetailPage;
