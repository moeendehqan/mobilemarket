import useProductsList from '../hooks/useProductsList';
import useUser from '../../auth/Hooks/useUser';
import { BiSolidMessageSquareDetail } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product.type';
import { useEffect, useState } from 'react';

// نشانگر شمارش معکوس رزرو تا زمان reversed_to
const CountdownBadge: React.FC<{ reversedTo?: string | null }> = ({ reversedTo }) => {
  const [label, setLabel] = useState<string>('');
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!reversedTo) {
      setExpired(false);
      setLabel('');
      return;
    }

    const target = new Date(reversedTo).getTime();
    if (isNaN(target)) {
      setExpired(true);
      setLabel('رزرو به پایان رسید');
      return;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setExpired(true);
        setLabel('رزرو به پایان رسید');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const timeStr = days > 0 ? `${days}روز ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      setExpired(false);
      setLabel(timeStr);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [reversedTo]);

  if (!reversedTo) return null;
  const cls = expired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-1 rounded-full text-sm ${cls}`}>{label}</span>;
};

// نشانگر قابلیت رزرو
const getAvailableBadge = (available: boolean) => {
  const info = available
    ? { text: 'قابل رزرو', class: 'bg-green-100 text-green-800' }
    : { text: 'غیرقابل رزرو', class: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 rounded-full text-sm ${info.class}`}>{info.text}</span>;
};

// کامپوننت: ProductTable

const formatPrice = (price: string | number | null) => {
  if (price === null || price === undefined) return '';
  const n = typeof price === 'string' ? parseInt(price) : price;
  return new Intl.NumberFormat('fa-IR').format(n) + ' تومان';
};

const formatDate = (date: string | null) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fa-IR');
};

const ProductTable = () => {
  const { data, isLoading, error } = useProductsList();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; class: string }> = {
      open: { text: 'باز', class: 'bg-green-100 text-green-800' },
      saled: { text: 'فروخته شده', class: 'bg-blue-100 text-blue-800' },
      canseled: { text: 'لغو شده', class: 'bg-red-100 text-red-800' },
      reserved: { text: 'رزرو شده', class: 'bg-yellow-100 text-yellow-800' },
    };
    const statusInfo = statusMap[status] || { text: '', class: '' };
    return <span className={`px-2 py-1 rounded-full text-sm ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { text: string; class: string }> = {
      new: { text: 'نو', class: 'bg-green-100 text-green-800' },
      'as new': { text: 'در حد نو', class: 'bg-blue-100 text-blue-800' },
      used: { text: 'کارکرده', class: 'bg-gray-100 text-gray-800' },
    };
    const typeInfo = typeMap[type] || { text: '', class: '' };
    return <span className={`px-2 py-1 rounded-full text-sm ${typeInfo.class}`}>{typeInfo.text}</span>;
  };
  const arrayData = Array.isArray(data) ? data : [];

  const filteredData = arrayData.filter((product: Product) => {
    const matchesSearch =
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof product.model_mobile === 'object' &&
        product.model_mobile?.model_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || product.status_product === statusFilter;
    const matchesType = !typeFilter || product.type_product === typeFilter;
    const matchesGrade = !gradeFilter || product.grade === gradeFilter;
    return matchesSearch && matchesStatus && matchesType && matchesGrade;
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right">
              <option value="">همه انواع</option>
              <option value="new">نو</option>
              <option value="used">کارکرده</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">درجه</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right">
              <option value="">همه درجات</option>
              <option value="A">A - در حد نو</option>
              <option value="B">B - خط و خش جزئی</option>
              <option value="C">C - خط و خش و ضربه</option>
              <option value="D">D - نیاز به تعمیر</option>
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
              onClick={() => product.id && navigate(`/products/${product.id}`)}>
              {/* تصویر محصول */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.picture && product.picture.length > 0 ? (
                  <img
                    src={product.picture[0].file || ''}
                    alt={product.description || 'محصول'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">📱</div>
                )}
              </div>

              {/* محتوای کارت */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                    {typeof product.model_mobile === 'object' ? product.model_mobile?.model_name : 'نام محصول'}
                  </h3>
                  <BiSolidMessageSquareDetail className="text-blue-500 text-xl ml-2 flex-shrink-0" />
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {typeof product.model_mobile === 'object' ? product.model_mobile?.brand : 'برند نامشخص'}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(product.status_product || '')}
                    {getTypeBadge(product.type_product || '')}
                    {typeof product.is_available === 'boolean' && getAvailableBadge(!!product.is_available)}
                    {product.reversed_to && <CountdownBadge reversedTo={product.reversed_to} />}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {user?.type_client === 'business' ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">قیمت همکار</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price ?? null)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">قیمت</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.customer_price ?? null)}
                      </span>
                    </div>
                  )}
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