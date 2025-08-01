import useDetailProduct from "../hooks/useDetailProduct";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BiArrowBack, BiCamera, BiImage } from "react-icons/bi";
import type { Camera } from "../types/camera.type";
import type { Picture } from "../types/picture.type";
import useOrderSet from "../../order/hooks/userOrderSet";


const formatPrice = (price: string | null) => {
  if (!price) return "";
  return new Intl.NumberFormat('fa-IR').format(parseInt(price)) + " تومان";
};

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('fa-IR');
};

const DetailProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useDetailProduct(id ?? '');
  const {isPending: isPendingOrderSet, mutate: mutateOrderSet } = useOrderSet(Number(id));

  if (isLoading || isPendingOrderSet) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">خطا در دریافت اطلاعات</p>
          <p>{error?.message || 'محصول یافت نشد'}</p>
        </div>
      </div>
    );
  }

  const statusMap: Record<string, { text: string; class: string }> = {
    open: { text: "باز", class: "bg-green-100 text-green-800" },
    saled: { text: "فروخته شده", class: "bg-blue-100 text-blue-800" },
    canseled: { text: "لغو شده", class: "bg-red-100 text-red-800" },
    reserved: { text: "رزرو شده", class: "bg-yellow-100 text-yellow-800" },
  };

  const typeMap: Record<string, { text: string; class: string }> = {
    new: { text: "نو", class: "bg-green-100 text-green-800" },
    "as new": { text: "در حد نو", class: "bg-blue-100 text-blue-800" },
    used: { text: "کارکرده", class: "bg-gray-100 text-gray-800" },
  };

  const guarantorMap: Record<string, { text: string; class: string }> = {
    guarantor: { text: "گارانتی دار", class: "bg-green-100 text-green-800" },
    guarantor_registered: { text: "گارانتی ثبت شده", class: "bg-blue-100 text-blue-800" },
    disregistered: { text: "فاقد گارانتی", class: "bg-red-100 text-red-800" },
  };

  // Handle camera data - it's an array of Camera objects
  const cameraData = Array.isArray(product.camera) ? product.camera as Camera[] : [];
  
  // Handle picture data - it's an array of Picture objects
  const pictureData = Array.isArray(product.picture) ? product.picture as Picture[] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-sm bg-white/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/products')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
              >
                <BiArrowBack className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
                <p className="text-gray-500 text-sm">جزئیات کامل محصول</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.status_product && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${statusMap[product.status_product]?.class}`}>
                  {statusMap[product.status_product]?.text}
                </span>
              )}
              {product.type_product && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${typeMap[product.type_product]?.class}`}>
                  {typeMap[product.type_product]?.text}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Specs */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                مشخصات اصلی
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">برند:</span>
                  <span className="font-semibold text-gray-800">{product.brand || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">قیمت:</span>
                  <span className="font-bold text-green-600 text-lg">{formatPrice(product.price ?? null)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">رنگ:</span>
                  <div className="flex items-center gap-2">
                    {product.color && typeof product.color === 'string' && product.color.startsWith('#') && (
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{backgroundColor: product.color}}></div>
                    )}
                    <span className="font-semibold text-gray-800">
                      {typeof product.color === 'object' && product.color?.name ? product.color.name : product.color || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">شماره قطعه:</span>
                  <span className="font-semibold text-gray-800 font-mono text-sm">{product.part_number || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">حافظه رم:</span>
                  <span className="font-semibold text-blue-600">{product.ram ? `${product.ram} GB` : '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">سیم کارت:</span>
                  <span className="font-semibold text-gray-800">{product.sim_card === '1' ? 'تک سیم‌کارت' : product.sim_card === '2' ? 'دو سیم‌کارت' : product.sim_card || '-'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                وضعیت باتری
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">ظرفیت باتری:</span>
                  <span className="font-semibold text-gray-800">{product.battry ? `${product.battry} mAh` : '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">سلامت باتری:</span>
                  <div className="flex items-center gap-2">
                    {product.battry_health && (
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            parseInt(product.battry_health) >= 80 ? 'bg-green-500' :
                            parseInt(product.battry_health) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{width: `${product.battry_health}%`}}
                        ></div>
                      </div>
                    )}
                    <span className="font-semibold text-gray-800">{product.battry_health ? `${product.battry_health}%` : '-'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">تعویض باتری:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.battry_change ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {product.battry_change ? 'بله' : 'خیر'}
                  </span>
                </div>
              </div>
            </div>

            {/* Camera Information */}
            {cameraData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BiCamera className="text-white text-lg" />
                  </div>
                  مشخصات دوربین ({cameraData.length})
                </h2>
                <div className="space-y-4">
                  {cameraData.map((camera, index) => (
                    <div key={camera.id} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                      <h3 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">{index + 1}</span>
                        دوربین {index + 1}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">نام:</span>
                          <span className="font-semibold text-gray-800">{camera.name || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">رزولوشن:</span>
                          <span className="font-semibold text-purple-600">{camera.resolution || '-'}</span>
                        </div>
                        {camera.description && (
                          <div className="mt-3">
                            <span className="text-gray-600 font-medium block mb-2">توضیحات:</span>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{camera.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

          {/* Middle Column - Product Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                جزئیات محصول
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">ابعاد:</span>
                  <span className="font-semibold text-gray-800">{product.size || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">شارژر:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.charger ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.charger ? 'دارد' : 'ندارد'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">جعبه:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.carton ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.carton ? 'دارد' : 'ندارد'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">تعمیر شده:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.repaired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {product.repaired ? 'بله' : 'خیر'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">محصول ویژه:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.hit_product ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.hit_product ? 'بله' : 'خیر'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">ثبت شده:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    product.registered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.registered ? 'بله' : 'خیر'}
                  </span>
                </div>
                {product.guarantor && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 font-medium">وضعیت گارانتی:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${guarantorMap[product.guarantor]?.class}`}>
                      {guarantorMap[product.guarantor]?.text}
                    </span>
                  </div>
                )}
              </div>
          </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                توضیحات
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description || 'توضیحاتی ثبت نشده است'}
                </p>
              </div>
              {product.technical_problem && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                    مشکلات فنی
                  </h3>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                    <p className="text-red-700 leading-relaxed">{product.technical_problem}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                اطلاعات ثبت
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">تاریخ ثبت:</span>
                  <span className="font-semibold text-gray-800">{formatDate(product.register_date ?? null)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">تاریخ ایجاد:</span>
                  <span className="font-semibold text-gray-800">{formatDate(product.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">آخرین بروزرسانی:</span>
                  <span className="font-semibold text-gray-800">{formatDate(product.updated_at)}</span>
                </div>
                {product.seller && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 font-medium">شناسه فروشنده:</span>
                    <span className="font-semibold text-gray-800">{product.seller}</span>
                  </div>
                )}
              </div>
            </div>
        </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
          {pictureData.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <BiImage className="text-white text-lg" />
                </div>
                تصاویر محصول ({pictureData.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pictureData.map((picture, index) => (
                  <div key={picture.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <div className="relative group">
                      <img 
                        src={"https://shikala.com"+picture.file} 
                        alt={picture.name || `تصویر محصول ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="hidden p-6 text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BiImage className="text-2xl text-gray-400" />
                      </div>
                      <p className="text-sm">تصویر قابل نمایش نیست</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-2">{picture.name || `تصویر ${index + 1}`}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                          <span>آپلود: {formatDate(picture.created_at)}</span>
                        </div>
                        {picture.updated_at !== picture.created_at && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span>بروزرسانی: {formatDate(picture.updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                  <BiImage className="text-white text-lg" />
                </div>
                تصاویر محصول
              </h2>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiImage className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">هیچ تصویری برای این محصول ثبت نشده است</p>
                <p className="text-sm text-gray-400 mt-2">تصاویر محصول در اینجا نمایش داده خواهد شد</p>
              </div>
            </div>
          )}

          {/* Summary Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
              خلاصه وضعیت
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 font-medium">وضعیت فروش:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusMap[product.status_product || '']?.class || 'bg-gray-100 text-gray-800'}`}>
                  {statusMap[product.status_product || '']?.text || '-'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 font-medium">نوع محصول:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeMap[product.type_product || '']?.class || 'bg-gray-100 text-gray-800'}`}>
                  {typeMap[product.type_product || '']?.text || '-'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 font-medium">لوازم جانبی:</span>
                <div className="flex flex-wrap gap-1">
                  {product.charger && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">شارژر</span>
                  )}
                  {product.carton && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">جعبه</span>
                  )}
                  {!product.charger && !product.carton && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">ندارد</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 font-medium">قیمت نهایی:</span>
                <span className="font-bold text-green-600 text-lg">{formatPrice(product.price ?? null)}</span>
              </div>
            </div>
            
            {/* Order Button */}
            <div className="mt-6">
              <button
                onClick={() => mutateOrderSet()}
                disabled={isPendingOrderSet || product.status_product === 'saled' || product.status_product === 'reserved'}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isPendingOrderSet || product.status_product === 'saled' || product.status_product === 'reserved'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isPendingOrderSet ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    در حال ثبت سفارش...
                  </div>
                ) : product.status_product === 'saled' ? (
                  'محصول فروخته شده'
                ) : product.status_product === 'reserved' ? (
                  'محصول رزرو شده'
                ) : (
                  'ثبت سفارش'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DetailProductPage;