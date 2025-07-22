import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useRegister from '../Hooks/useRegister';
import type { UserType } from '../types/user.type';
import { useNavigate } from 'react-router-dom';
import useUser from '../Hooks/useUser';

const registerSchema = z.object({
    uniqidentifier: z.string().min(10, 'کد ملی باید 10 رقم باشد').max(10, 'کد ملی باید 10 رقم باشد'),
    first_name: z.string().min(2, 'نام باید حداقل 2 حرف باشد'),
    last_name: z.string().min(2, 'نام خانوادگی باید حداقل 2 حرف باشد'),
    email: z.string().email('ایمیل نامعتبر است').optional(),
    mobile: z.string().regex(/^09\d{9}$/, 'شماره موبایل نامعتبر است'),
    address: z.string().optional(),
    city: z.string().optional(),
    company: z.string().min(2, 'نام فروشگاه باید حداقل 2 حرف باشد'),
    sheba_number: z.string().regex(/^IR[0-9]{24}$/, 'شماره شبا باید با IR شروع شود و 24 رقم باشد'),
    card_number: z.string().regex(/^[0-9]{16}$/, 'شماره کارت باید 16 رقم باشد'),
    account_number: z.string().optional(),
    account_bank: z.string().min(2, 'نام بانک باید حداقل 2 حرف باشد')
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });
    const navigate = useNavigate();

    const { data: user } = useUser();

    if (user) {
        if (user.is_register) {
            navigate('/');
        }
    }

    const { mutate, isPending, error, isSuccess } = useRegister();

    if (isSuccess && !isPending) {
        navigate('/');
    }

    const onSubmit = (data: UserType) => {
        mutate(data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">ثبت نام</h2>
            <form onSubmit={handleSubmit((data: RegisterFormData) => onSubmit(data as UserType))} className="space-y-4" dir="rtl">
                <div>
                    <label className="block text-sm font-medium text-gray-700">کد ملی *</label>
                    <input
                        type="text"
                        {...register('uniqidentifier')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.uniqidentifier && <p className="mt-1 text-sm text-red-600">{errors.uniqidentifier.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">نام *</label>
                    <input
                        type="text"
                        {...register('first_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">نام خانوادگی *</label>
                    <input
                        type="text"
                        {...register('last_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">ایمیل</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">شماره موبایل *</label>
                    <input
                        type="tel"
                        {...register('mobile')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="09123456789"
                    />
                    {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">نام فروشگاه *</label>
                    <input
                        type="text"
                        {...register('company')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">شهر</label>
                    <input
                        type="text"
                        {...register('city')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">آدرس فروشگاه</label>
                    <textarea
                        {...register('address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">شماره شبا *</label>
                    <input
                        type="text"
                        {...register('sheba_number')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="IR000000000000000000000000"
                        dir="ltr"
                    />
                    {errors.sheba_number && <p className="mt-1 text-sm text-red-600">{errors.sheba_number.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">شماره کارت *</label>
                    <input
                        type="text"
                        {...register('card_number')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0000000000000000"
                        dir="ltr"
                    />
                    {errors.card_number && <p className="mt-1 text-sm text-red-600">{errors.card_number.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">شماره حساب</label>
                    <input
                        type="text"
                        {...register('account_number')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        dir="ltr"
                    />
                    {errors.account_number && <p className="mt-1 text-sm text-red-600">{errors.account_number.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">بانک *</label>
                    <input
                        type="text"
                        {...register('account_bank')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.account_bank && <p className="mt-1 text-sm text-red-600">{errors.account_bank.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isPending ? 'در حال ثبت نام...' : 'ثبت نام'}
                </button>
                {error && (
                    <div className="mt-4 p-2 text-sm text-red-600 bg-red-100 rounded">
                        خطا در ثبت نام: {error.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegisterForm;
