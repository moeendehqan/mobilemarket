import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BiCheckCircle, BiXCircle, BiArrowBack, BiWallet } from 'react-icons/bi';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');
    const [countdown, setCountdown] = useState(10);

    const isSuccess = status === 'success';

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/wallet');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className={`p-8 text-center ${isSuccess ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className="flex justify-center mb-6">
                        {isSuccess ? (
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                                <BiCheckCircle className="text-6xl text-emerald-600" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                <BiXCircle className="text-6xl text-red-600" />
                            </div>
                        )}
                    </div>
                    
                    <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-emerald-800' : 'text-red-800'}`}>
                        {isSuccess ? 'پرداخت موفق' : 'پرداخت ناموفق'}
                    </h1>
                    
                    <p className={`text-sm ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isSuccess 
                            ? 'عملیات پرداخت با موفقیت انجام شد و کیف پول شما شارژ گردید.' 
                            : 'متاسفانه عملیات پرداخت با خطا مواجه شد. در صورت کسر وجه، مبلغ طی ۷۲ ساعت به حساب شما بازخواهد گشت.'}
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate('/wallet')}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[102%] flex items-center justify-center gap-2
                                ${isSuccess 
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700' 
                                    : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                                }`}
                        >
                            <BiWallet className="text-xl" />
                            <span>بازگشت به کیف پول</span>
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <BiArrowBack className="text-xl" />
                            <span>بازگشت به صفحه اصلی</span>
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            انتقال خودکار به کیف پول در <span className="font-bold text-gray-600 mx-1">{countdown}</span> ثانیه
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResultPage;
