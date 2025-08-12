import useProductsList from "../hooks/useProductsList";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product.type";
import { useState } from "react";

const formatPrice = (price: string | null) => {
  if (!price) return "";
  return new Intl.NumberFormat('fa-IR').format(parseInt(price)) + " تومان";
};

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('fa-IR');
};

const ProductTable = () => {
  const { data, isLoading, error } = useProductsList();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");


  

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; class: string }> = {
      open: { text: "باز", class: "bg-green-100 text-green-800" },
      saled: { text: "فروخته شده", class: "bg-blue-100 text-blue-800" },
      canseled: { text: "لغو شده", class: "bg-red-100 text-red-800" },
      reserved: { text: "رزرو شده", class: "bg-yellow-100 text-yellow-800" },
    };
    const statusInfo = statusMap[status] || { text: "", class: "" };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { text: string; class: string }> = {
      new: { text: "نو", class: "bg-green-100 text-green-800" },
      "as new": { text: "در حد نو", class: "bg-blue-100 text-blue-800" },
      used: { text: "کارکرده", class: "bg-gray-100 text-gray-800" },
    };
    const typeInfo = typeMap[type] || { text: "", class: "" };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${typeInfo.class}`}>
        {typeInfo.text}
      </span>
    );
  };

  const filteredData = data?.filter((product: Product) => {
    const matchesSearch = product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof product.model_mobile === 'object' && product.model_mobile?.model_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || product.status_product === statusFilter;
    const matchesType = !typeFilter || product.type_product === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
        <h1 className="text-xl font-bold text-gray-800">لیست محصولات</h1>
      </div>
      
      {/* فیلترها */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
            <input
              type="text"
              placeholder="جستجو در نام یا برند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="saled">فروخته شده</option>
              <option value="canseled">لغو شده</option>
              <option value="reserved">رزرو شده</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع محصول</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            >
              <option value="">همه انواع</option>
              <option value="new">نو</option>
              <option value="used">کارکرده</option>
            </select>
          </div>
        </div>
      </div>

      {/* کارت‌های محصولات */}
      {filteredData && filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => product.id && navigate(`/products/${product.id}`)}
            >
              {/* تصویر محصول */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.picture && product.picture.length > 0 ? (
                  <img
                    src={product.picture[0].file}
                    alt={product.description || "محصول"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">
                    📱
                  </div>
                )}
              </div>
              
              {/* محتوای کارت */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                    {typeof product.model_mobile === 'object' ? product.model_mobile?.model_name : "نام محصول"}
                  </h3>
                  <BiSolidMessageSquareDetail className="text-blue-500 text-xl ml-2 flex-shrink-0" />
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {typeof product.model_mobile === 'object' ? product.model_mobile?.brand : "برند نامشخص"}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  {getStatusBadge(product.status_product || "")}
                  {getTypeBadge(product.type_product || "")}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price?.toString() || null)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(product.created_at || null)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📱</div>
          <p className="text-gray-600 text-lg">هیچ محصولی موجود نیست</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
