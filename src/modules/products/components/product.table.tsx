import useProductsList from '../hooks/useProductsList';
import useUser from '../../auth/Hooks/useUser';
import type { Product } from '../types/product.type';
import { useEffect, useState } from 'react';
import ProductCard from './product.cart';
import { CARTON_OPTIONS } from './product-form/constants';

// کامپوننت: ProductTable

const ProductTable = () => {
  const { data, isLoading, error } = useProductsList();
  const { data: user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [cartonFilter, setCartonFilter] = useState('');
  const [repairedFilter, setRepairedFilter] = useState('');
  const arrayData = Array.isArray(data) ? data : [];

  const filteredData = arrayData.filter((product: Product) => {
    const matchesSearch =
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof product.model_mobile === 'object' &&
        product.model_mobile?.model_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || product.status_product === statusFilter;
    const matchesType = !typeFilter || product.type_product === typeFilter;
    const matchesGrade = !gradeFilter || product.grade === gradeFilter;
    const matchesCarton = !cartonFilter || product.carton === cartonFilter;
    const matchesRepaired = !repairedFilter || String(product.repaired) === repairedFilter;
    return matchesSearch && matchesStatus && matchesType && matchesGrade && matchesCarton && matchesRepaired;
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
              <option value="open">قابل سفارش</option>
              <option value="saled">فروخته شده</option>
              <option value="canseled">لغو شده</option>
              <option value="reserved">بیع</option>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">کارتن</label>
            <select
              value={cartonFilter}
              onChange={(e) => setCartonFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right">
              <option value="">همه</option>
              {CARTON_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تعمیر شده</label>
            <select
              value={repairedFilter}
              onChange={(e) => setRepairedFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right">
              <option value="">همه</option>
              <option value="true">بله</option>
              <option value="false">خیر</option>
            </select>
          </div>
        </div>
      </div>

      {/* کارت‌های محصولات */}
      {filteredData && filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((product: Product) => (
            <ProductCard key={product.id} product={product} user={user} />
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
