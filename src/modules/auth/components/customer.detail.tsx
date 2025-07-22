/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from "react-hook-form";
import useCustomerDetail from "../Hooks/useCustomerDetail";
import { useEffect } from "react";
import useCustomerUpdate from "../Hooks/useCustomerUpdate";
import { toast } from "react-hot-toast";

type Customer = {
  username: string;
  mobile: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  company: string | null;
  sheba_number: string | null;
  card_number: string | null;
  account_number: string | null;
  account_bank: string | null;
  is_verified: boolean;
  is_active: boolean;
  admin: boolean;
  work_guarantee: boolean;
  is_register: boolean;
};

const Input = ({
  label,
  register,
  name,
  type = "text",
  error,
}: {
  label: string;
  register: any;
  name: keyof Customer;
  type?: string;
  error?: string;
}) => (
  <div className="flex flex-col gap-3">
    <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
      {label}
    </label>
    <input
      type={type}
      {...register(name)}
      className={`px-5 py-3.5 rounded-2xl border-2 ${error ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
      placeholder={`${label} را وارد کنید...`}
    />
    {error && <span className="text-sm text-red-500 font-medium flex items-center gap-1">
      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
      {error}
    </span>}
  </div>
);

const Checkbox = ({
  label,
  register,
  name,
  disabled = false,
}: {
  label: string;
  register: any;
  name: keyof Customer;
  disabled?: boolean;
}) => (
  <label
    className={`inline-flex items-center gap-4 p-4 rounded-2xl border-2 ${disabled ? 'text-gray-400 cursor-not-allowed border-gray-200 bg-gray-50/50' : 'text-gray-700 hover:text-gray-900 border-gray-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50/20 hover:shadow-lg cursor-pointer'} transition-all duration-300 font-medium`}
  >
    <input
      type="checkbox"
      {...register(name)}
      disabled={disabled}
      className={`w-6 h-6 rounded-lg ${disabled ? 'border-gray-300 bg-gray-100' : 'border-gray-300 bg-white'} checked:bg-gradient-to-br checked:from-blue-500 checked:to-purple-500 checked:border-blue-500 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30 transition-all duration-300 shadow-md`}
    />
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${disabled ? 'bg-gray-300' : 'bg-gradient-to-r from-blue-400 to-purple-400'}`}></span>
      {label}
    </span>
  </label>
);

const CustomerDetail = ({ id }: { id: string }) => {
  const { data: customerDetail, isLoading } = useCustomerDetail(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Customer>();

  useEffect(() => {
    if (customerDetail) {
      reset(customerDetail);
    }
  }, [customerDetail, reset]);

  const { mutate: updateCustomer, isPending } = useCustomerUpdate();
  
  const onSubmit = async (data: Customer) => {
    try {
      await updateCustomer({ id, data });
      toast.success("اطلاعات مشتری با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error("خطا در به‌روزرسانی اطلاعات مشتری");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10 p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">#{id}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">ویرایش اطلاعات مشتری</h1>
              <p className="text-gray-500 font-medium">مدیریت و ویرایش اطلاعات کاربر</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-200">
            آخرین ویرایش: {new Date().toLocaleDateString('fa-IR')}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">👤</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">اطلاعات شخصی</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="نام کاربری" name="username" register={register} error={errors.username?.message} />
              <Input label="شماره موبایل" name="mobile" register={register} error={errors.mobile?.message} />
              <Input label="نام" name="first_name" register={register} error={errors.first_name?.message} />
              <Input label="نام خانوادگی" name="last_name" register={register} error={errors.last_name?.message} />
              <Input label="ایمیل" name="email" type="email" register={register} error={errors.email?.message} />
              <Input label="آدرس" name="address" register={register} error={errors.address?.message} />
              <Input label="شهر" name="city" register={register} error={errors.city?.message} />
              <Input label="شرکت" name="company" register={register} error={errors.company?.message} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏦</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">اطلاعات بانکی</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="شماره شبا" name="sheba_number" register={register} error={errors.sheba_number?.message} />
              <Input label="شماره کارت" name="card_number" register={register} error={errors.card_number?.message} />
              <Input label="شماره حساب" name="account_number" register={register} error={errors.account_number?.message} />
              <Input label="نام بانک" name="account_bank" register={register} error={errors.account_bank?.message} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚙️</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">تنظیمات حساب کاربری</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Checkbox label="اطلاعات معتبر" name="is_verified" register={register} />
              <Checkbox label="فعال" name="is_active" register={register} />
              <Checkbox label="ادمین" name="admin" register={register} disabled={true} />
              <Checkbox label="حسن انجام کار" name="work_guarantee" register={register} />
              <Checkbox label="ثبت‌نام کامل شده" name="is_register" register={register} disabled={true} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => reset(customerDetail)}
                className="px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3"
                disabled={!isDirty || isPending}
              >
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                انصراف
              </button>
              <button
                type="submit"
                disabled={!isDirty || isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                {isPending && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                )}
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetail;
