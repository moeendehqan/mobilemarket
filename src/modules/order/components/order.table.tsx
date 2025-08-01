import useOrderList from "../hooks/useOrderList";
import { useNavigate } from "react-router-dom";
import type { OrderType } from "../type/order";
import useUser from "../../auth/Hooks/useUser";
import { useState, useMemo } from "react";

const formatPrice = (price: string | null) => {
  if (!price) return "";
  return new Intl.NumberFormat('fa-IR').format(parseInt(price)) + " تومان";
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
  };
  return statusMap[status] || { text: status || "-", class: "bg-gray-100 text-gray-800 border-gray-200" };
};

const OrderTable = () => {
  const { data, isLoading, error } = useOrderList();
  const { data: currentUser } = useUser();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'received' | 'sent'>('all');

  // فیلتر کردن داده‌ها بر اساس نوع فیلتر انتخاب شده
  const filteredData = useMemo(() => {
    if (!data || !currentUser) return data;
    
    switch (filterType) {
      case 'received':
        // سفارشات دریافتی: سفارشاتی که فروشنده کاربر فعلی است
        return data.filter((order: OrderType) => order.seller?.id === currentUser.id);
      case 'sent':
        // سفارشات ارسالی: سفارشاتی که خریدار کاربر فعلی است
        return data.filter((order: OrderType) => order.buyer?.id === currentUser.id);
      default:
        return data;
    }
  }, [data, currentUser, filterType]);

  // تشخیص نوع سفارش برای هر کاربر
  const getOrderType = (order: OrderType) => {
    if (!currentUser) return null;
    if (order.seller?.id === currentUser.id) return 'received'; // سفارش دریافتی
    if (order.buyer?.id === currentUser.id) return 'sent'; // سفارش ارسالی
    return null;
  };

  const handleCardClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

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
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">خطا در دریافت اطلاعات</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">لیست سفارشات</h1>
        
        {/* فیلتر سفارشات */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">نمایش:</span>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as 'all' | 'received' | 'sent')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">همه سفارشات</option>
            <option value="received">سفارشات دریافتی</option>
            <option value="sent">سفارشات ارسالی</option>
          </select>
        </div>
      </div>
      
      {/* نمایش کارت‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((order: OrderType) => {
            const statusInfo = getStatusInfo(order.status);
            const orderType = getOrderType(order);
            return (
              <div 
                key={order.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => order.id && handleCardClick(order.id)}
              >
                {/* شناسه سفارش و نوع سفارش */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">شناسه سفارش</span>
                    {orderType && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        orderType === 'received' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}>
                        {orderType === 'received' ? 'دریافتی' : 'ارسالی'}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-gray-800">#{order.id}</span>
                </div>
                
                {/* اطلاعات محصول */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{order.product?.model_mobile?.model_name || 'نام محصول موجود نیست'}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">برند:</span>
                      <span className="text-sm font-medium text-gray-800">{order.product?.model_mobile?.brand || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">قیمت:</span>
                      <span className="text-sm font-bold text-green-600">{formatPrice(order.product?.price?.toString())}</span>
                    </div>
                  </div>
                </div>
                
                {/* وضعیت سفارش */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.class}`}>
                    {statusInfo.text}
                  </span>
                </div>
                
                {/* تاریخ‌ها */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>تاریخ فروش:</span>
                    <span>{formatDate(order.sell_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاریخ ثبت:</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>
                
                {/* دکمه مشاهده جزئیات */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex items-center justify-center min-h-[200px]">
            <p className="text-gray-500 text-lg">هیچ سفارشی موجود نیست</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
