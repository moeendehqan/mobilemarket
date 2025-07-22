import useOrderList from "../hooks/useOrderList";
import { ReactTabulator } from "react-tabulator";
import { useNavigate } from "react-router-dom";
import type { OrderType } from "../type/order";
import "react-tabulator/lib/styles.css";
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

const formatUserName = (user: any) => {
  if (!user) return "-";
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  return `${firstName} ${lastName}`.trim() || user.username || "-";
};

const OrderTable = () => {
  const { data, isLoading, error } = useOrderList();
  const { data: currentUser } = useUser();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'buyer' | 'seller'>('all');

  // فیلتر کردن داده‌ها بر اساس نوع فیلتر انتخاب شده
  const filteredData = useMemo(() => {
    if (!data || !currentUser) return data;
    
    switch (filterType) {
      case 'buyer':
        return data.filter((order: OrderType) => order.buyer_id === currentUser.id);
      case 'seller':
        return data.filter((order: OrderType) => order.seller_id === currentUser.id);
      default:
        return data;
    }
  }, [data, currentUser, filterType]);

  const detailsFormatter = () => {
    return `<button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer">
      <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      مشاهده جزئیات
    </button>`;
  };

  const statusFormatter = (cell: any) => {
    const value = cell.getValue();
    const statusMap: Record<string, { text: string; class: string }> = {
      pending: { text: "در انتظار", class: "bg-yellow-100 text-yellow-800" },
      confirmed: { text: "تایید شده", class: "bg-green-100 text-green-800" },
      delivered: { text: "تحویل داده شده", class: "bg-blue-100 text-blue-800" },
      cancelled: { text: "لغو شده", class: "bg-red-100 text-red-800" },
    };
    const status = statusMap[value] || { text: value || "-", class: "bg-gray-100 text-gray-800" };
    return `<span class="px-2 py-1 rounded-full text-sm ${status.class}">${status.text}</span>`;
  };

  const columns = [
    {
      title: "شناسه سفارش",
      field: "id",
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 120
    },
    {
      title: "نام محصول",
      field: "product.name",
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 200
    },
    {
      title: "برند محصول",
      field: "product.brand",
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 120
    },
    {
      title: "قیمت",
      field: "product.price",
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      formatter: (cell: any) => formatPrice(cell.getValue()),
      width: 150
    },
    {
      title: "خریدار",
      field: "buyer",
      formatter: (cell: any) => formatUserName(cell.getValue()),
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 150
    },
    {
      title: "فروشنده",
      field: "seller",
      formatter: (cell: any) => formatUserName(cell.getValue()),
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 150
    },
    {
      title: "وضعیت سفارش",
      field: "status",
      formatter: statusFormatter,
      headerFilter: "select",
      headerFilterParams: {
        values: {
          pending: "در انتظار",
          confirmed: "تایید شده",
          delivered: "تحویل داده شده",
          cancelled: "لغو شده",
        }
      },
      width: 140
    },
    {
      title: "تاریخ فروش",
      field: "sell_date",
      formatter: (cell: any) => formatDate(cell.getValue()),
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 120
    },
    {
      title: "تاریخ ثبت",
      field: "created_at",
      formatter: (cell: any) => formatDate(cell.getValue()),
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 120
    },
    {
      title: "عملیات",
      formatter: detailsFormatter,
      width: 140,
      hozAlign: "center",
      headerSort: false,
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as OrderType;
        if (rowData.id) {
          navigate(`/orders/${rowData.id}`);
        }
      },
    },
  ];

  const options = {
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 50],
    movableColumns: true,
    placeholder: "هیچ سفارشی موجود نیست",
    langs: {
      default: {
        pagination: {
          page_size: "تعداد در صفحه",
          first: "اولین",
          first_title: "صفحه اول",
          last: "آخرین",
          last_title: "صفحه آخر",
          prev: "قبلی",
          prev_title: "صفحه قبل",
          next: "بعدی",
          next_title: "صفحه بعد",
        },
      },
    },
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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">لیست سفارشات</h1>
        
        {/* فیلتر سفارشات */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">نمایش:</span>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as 'all' | 'buyer' | 'seller')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">همه سفارشات</option>
            <option value="buyer">سفارشات خریداری شده</option>
            <option value="seller">سفارشات فروخته شده</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <ReactTabulator
          data={filteredData}
          columns={columns as any}
          options={options}
          className="custom-tabulator"
        />
      </div>
    </div>
  );
};

export default OrderTable;
