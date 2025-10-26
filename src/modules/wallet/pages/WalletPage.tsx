import React, { useState } from 'react';
import { IoWallet } from 'react-icons/io5';

const WalletPage = () => {
  const balance = 5000000; // موجودی اولیه 5 میلیون تومان - این مقدار از بک‌اند دریافت می‌شود
  const [inputAmount, setInputAmount] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const handleIncrease = () => {
    const currentAmount = parseInt(inputAmount) || 0;
    setInputAmount((currentAmount + 100000).toString());
  };

  const handleDecrease = () => {
    const currentAmount = parseInt(inputAmount) || 0;
    if (currentAmount >= 100000) {
      setInputAmount((currentAmount - 100000).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // فقط اعداد
    setInputAmount(value);
  };

  const handleCharge = () => {
    // اینجا می‌توانید منطق شارژ کیف پول را پیاده‌سازی کنید
    alert('در حال اتصال به درگاه پرداخت...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-md mx-auto">
        {/* هدر کیف پول */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">کیف پول</h1>
          <p className="text-gray-600">اعتبار فعلی شما</p>
        </div>

        {/* کارت موجودی */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IoWallet className="text-white" size={32} />
                <div className="mr-3">
                  <p className="text-blue-100 text-sm">موجودی</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(balance)} <span className="text-sm font-normal">تومان</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* کنترل‌های موجودی */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">تنظیم موجودی</h3>

          {/* ورودی مبلغ دستی */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ دلخواه (حداقل 100,000 تومان)</label>
              <div className="flex">
                <input
                  type="text"
                  value={inputAmount}
                  onChange={handleInputChange}
                  placeholder="مبلغ را وارد کنید"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-1 focus:border-transparent outline-none text-right"
                />
                <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                  تومان
                </span>
              </div>
            </div>
          </div>

          {/* دکمه‌های کم و زیاد */}
          <div className="flex items-center justify-center mt-6">
            <button
              onClick={handleDecrease}
              disabled={!inputAmount || parseInt(inputAmount) < 100000}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <div className="mx-6 text-center">
              <p className="text-sm text-gray-600 mb-1">تغییرات 100,000 تومانی</p>
            </div>

            <button
              onClick={handleIncrease}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleCharge}
            disabled={!inputAmount || parseInt(inputAmount) < 100000}
            className="mt-8 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transform hover:scale-[102%] transition-all duration-200 w-full">
            <div className="flex items-center justify-center">شارژ کیف پول</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
