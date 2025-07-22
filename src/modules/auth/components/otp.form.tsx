import { useOtp, useLogin } from '../Hooks';


import { useState, useEffect } from 'react';

const OtpForm = () => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [showResend, setShowResend] = useState(false);
    const {mutate: sendOtp} = useOtp(phoneNumber)
    const {mutate: login} = useLogin(phoneNumber, otp)

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        setShowResend(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, timer]);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendOtp()
        setStep(2);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login()
    };

    const handleResendCode = () => {
        setTimer(60);
        setShowResend(false);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
            <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>
            {step === 1 ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">ورود شماره همراه</h2>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            شماره همراه
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="شماره همراه خود را وارد کنید"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 font-medium"
                    >
                        ارسال کد تایید
                    </button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            بازگشت
                        </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-gray-600">شماره همراه شما</div>
                        <div className="text-lg font-semibold text-gray-800 mt-1">{phoneNumber}</div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">کد تایید</h2>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            کد تایید ارسال شده را وارد کنید
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center tracking-[0.5em] text-xl"
                            placeholder="کد تایید را وارد کنید"
                            required
                        />
                    </div>
                    <div className="text-center text-sm text-gray-600">
                        {!showResend ? (
                            <p>زمان باقی‌مانده: {timer} ثانیه</p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                            >
                                ارسال مجدد کد
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 font-medium"
                    >
                        تایید
                    </button>
                </form>
            )}
        </div>
    );
};

export default OtpForm;
