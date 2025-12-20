import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ListMeProductService from "../service/list-me-product.service";
import useDeleteProduct from "../hooks/useDeleteProduct";
import type { Product } from "../types/product.type";

const formatPrice = (price: string | number | null | undefined) => {
  if (price === null || price === undefined) return "";
  const n = typeof price === "string" ? parseInt(price) : price;
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fa-IR");
};

const getStatusBadge = (status?: string | null) => {
  const statusMap: Record<string, { text: string; class: string }> = {
    open: { text: "قابل سفارش", class: "bg-green-100 text-green-800" },
    saled: { text: "فروخته شده", class: "bg-blue-100 text-blue-800" },
    canseled: { text: "لغو شده", class: "bg-red-100 text-red-800" },
    reserved: { text: "بیع", class: "bg-yellow-100 text-yellow-800" },
  };
  const key = status || "";
  const statusInfo = statusMap[key] || { text: "-", class: "bg-gray-100 text-gray-800" };
  return <span className={`px-2 py-1 rounded-full text-sm ${statusInfo.class}`}>{statusInfo.text}</span>;
};

const getTypeBadge = (type?: string | null) => {
  const typeMap: Record<string, { text: string; class: string }> = {
    new: { text: "نو", class: "bg-green-100 text-green-800" },
    "as new": { text: "در حد نو", class: "bg-blue-100 text-blue-800" },
    used: { text: "کارکرده", class: "bg-gray-100 text-gray-800" },
  };
  const key = type || "";
  const typeInfo = typeMap[key] || { text: "-", class: "bg-gray-100 text-gray-800" };
  return <span className={`px-2 py-1 rounded-full text-sm ${typeInfo.class}`}>{typeInfo.text}</span>;
};

const getAvailableBadge = (available?: boolean) => {
  const info = available
    ? { text: "قابل رزرو", class: "bg-green-100 text-green-800" }
    : { text: "غیرقابل رزرو", class: "bg-gray-100 text-gray-800" };
  return <span className={`px-2 py-1 rounded-full text-sm ${info.class}`}>{info.text}</span>;
};

const ProductMeTable = () => {
  const navigate = useNavigate();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    ListMeProductService()
      .then((res) => {
        if (!mounted) return;
        const arr = Array.isArray(res) ? res : [];
        setData(arr);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e as Error);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = (Array.isArray(data) ? data : []).filter((product) => {
    const name =
      typeof product.model_mobile === "object" ? product.model_mobile?.model_name || "" : "";
    const brand = typeof product.model_mobile === "object" ? product.model_mobile?.brand || "" : "";
    const desc = product.description || "";
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      name.toLowerCase().includes(term) ||
      brand.toLowerCase().includes(term) ||
      desc.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-bold mb-1">خطا در دریافت اطلاعات</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">لیست اگهی‌های من</h2>
        <div className="w-64">
          <input
            type="text"
            placeholder="جستجو در نام/برند/توضیحات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
              onClick={() => product.id && navigate(`/products/${product.id}`)}
            >
              <button
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("آیا از حذف این محصول مطمئن هستید؟")) {
                    deleteProduct(product).then(() => {
                      setData((prev) => prev.filter((p) => p.id !== product.id));
                      toast.success("محصول با موفقیت حذف شد");
                    });
                  }
                }}
                className="absolute top-2 left-2 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors z-10 shadow-sm"
                title="حذف محصول"
              >
                <FaTrash size={14} />
              </button>
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {product.picture && product.picture.length > 0 ? (
                  <img
                    src={product.picture[0]?.file || ""}
                    alt={product.description || "محصول"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">📱</div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800">
                      {typeof product.model_mobile === "object"
                        ? product.model_mobile?.model_name
                        : "نام محصول"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {typeof product.model_mobile === "object"
                        ? product.model_mobile?.brand
                        : "برند نامشخص"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {getStatusBadge(product.status_product)}
                  {getTypeBadge(product.type_product)}
                  {getAvailableBadge(!!product.is_available)}
                </div>

                // کامپوننت: ProductMeTable
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">قیمت همکار</span>
                    <span className="text-base font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">قیمت مشتری</span>
                    <span className="text-base font-bold text-green-600">
                      {formatPrice(product.customer_price)}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{formatDate(product.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-16">
          <div className="text-6xl mb-4">📭</div>
          <p>هنوز اگهی فعالی ندارید</p>
        </div>
      )}
    </div>
  );
};

export default ProductMeTable;