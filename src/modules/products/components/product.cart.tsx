import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidMessageSquareDetail } from 'react-icons/bi';
import type { Product } from '../types/product.type';

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

const formatPrice = (price: string | number | null) => {
  if (price === null || price === undefined) return '';
  const n = typeof price === 'string' ? parseInt(price) : price;
  return new Intl.NumberFormat('fa-IR').format(n) + ' تومان';
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { text: string; class: string }> = {
    open: { text: 'قابل سفارش', class: 'bg-green-100 text-green-800' },
    saled: { text: 'فروخته شده', class: 'bg-blue-100 text-blue-800' },
    canseled: { text: 'لغو شده', class: 'bg-red-100 text-red-800' },
    reserved: { text: 'بیع', class: 'bg-yellow-100 text-yellow-800' },
  };
  const statusInfo = statusMap[status] || { text: '', class: '' };
  return <span className={`px-2 py-1 rounded-full text-sm ${statusInfo.class}`}>{statusInfo.text}</span>;
};

const getTypeBadge = (type: string) => {
  if (!type) return null;
  const normalizedType = type.toLowerCase().trim();

  const typeMap: Record<string, { text: string; class: string }> = {
    new: { text: 'نو', class: 'bg-green-100 text-green-800' },
    'as new': { text: 'در حد نو', class: 'bg-blue-100 text-blue-800' },
    used: { text: 'کارکرده', class: 'bg-gray-100 text-gray-800' },
  };

  const typeInfo = typeMap[normalizedType];
  if (!typeInfo) return null;
  return <span className={`px-2 py-1 rounded-full text-sm ${typeInfo.class}`}>{typeInfo.text}</span>;
};

const getColorBadge = (color: Product['color']) => {
  if (!color || typeof color === 'number') return null;

  let hex = '#e5e7eb';
  let name = '';

  if (typeof color === 'string') {
    name = color;
  } else if (typeof color === 'object') {
    const c = color as any;
    hex = c.hex_code || hex;
    name = c.name || '';
  }

  if (!name) return null;

  return (
    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-200" title={name}>
      <span
        className="w-3 h-3 rounded-full border border-gray-300"
        style={{ backgroundColor: hex }}
      />
      <span className="text-xs text-gray-700">{name}</span>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  user?: { type_client?: string } | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, user }) => {
  const navigate = useNavigate();

  return (
    <div
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
            {getTypeBadge(product.type_product || 'new')}
            {getColorBadge(product.color)}
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
  );
};

export default ProductCard;