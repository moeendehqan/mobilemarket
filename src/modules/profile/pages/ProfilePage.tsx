import { useEffect, useState } from 'react';
import useUser from '../../auth/Hooks/useUser';
import useUserUpdate from '../../auth/Hooks/useUserUpdate';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { data: user, isLoading } = useUser();
  const { mutate, isPending } = useUserUpdate();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    company: '',
    sheba_number: '',
    card_number: '',
    account_number: '',
    account_bank: '',
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    business_license: null,
    head_store_image: null,
    store_window_image: null,
    Warranty_check_image: null,
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        address: user.address || '',
        company: user.company || '',
        sheba_number: user.sheba_number || '',
        card_number: user.card_number || '',
        account_number: user.account_number || '',
        account_bank: user.account_bank || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selected } = e.target;
    const file = selected && selected[0] ? selected[0] : null;
    setFiles(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, value);
      }
    });
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        fd.append(key, file);
      }
    });

    mutate(fd, {
      onSuccess: () => {
        toast.success('پروفایل با موفقیت بروزرسانی شد');
        setIsEditing(false);
      },
      onError: () => {
        toast.error('بروزرسانی پروفایل با خطا مواجه شد');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">خطا در بارگذاری اطلاعات کاربر</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">اطلاعات پروفایل</h1>
        <div className="space-x-2 rtl:space-x-reverse">
          {!isEditing ? (
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setIsEditing(true)}
            >
              ویرایش پروفایل
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => {
                  setIsEditing(false);
                  if (user) {
                    setForm({
                      first_name: user.first_name || '',
                      last_name: user.last_name || '',
                      email: user.email || '',
                      address: user.address || '',
                      company: user.company || '',
                      sheba_number: user.sheba_number || '',
                      card_number: user.card_number || '',
                      account_number: user.account_number || '',
                      account_bank: user.account_bank || '',
                    });
                    setFiles({
                      business_license: null,
                      head_store_image: null,
                      store_window_image: null,
                      Warranty_check_image: null,
                    });
                  }
                }}
              >
                انصراف
              </button>
              <button
                type="submit"
                form="profile-form"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          )}
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* اطلاعات شخصی */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">اطلاعات شخصی</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">نام:</label>
              {isEditing ? (
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="نام کوچک"
                />
              ) : (
                <p className="text-gray-900">{user.first_name || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">نام خانوادگی:</label>
              {isEditing ? (
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="نام خانوادگی"
                />
              ) : (
                <p className="text-gray-900">{user.last_name || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">نام کاربری:</label>
              <p className="text-gray-900">{user.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">ایمیل:</label>
              {isEditing ? (
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="ایمیل"
                />
              ) : (
                <p className="text-gray-900">{user.email || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شماره موبایل:</label>
              <input
                value={user.mobile || ''}
                disabled
                className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* اطلاعات آدرس */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">اطلاعات آدرس</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">آدرس:</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="آدرس فروشگاه"
                  rows={3}
                />
              ) : (
                <p className="text-gray-900">{user.address || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شهر:</label>
              <input
                value={user.city || ''}
                disabled
                className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شرکت:</label>
              {isEditing ? (
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="نام فروشگاه"
                />
              ) : (
                <p className="text-gray-900">{user.company || 'تعریف نشده'}</p>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات بانکی */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">اطلاعات بانکی</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">شماره شبا:</label>
              {isEditing ? (
                <input
                  name="sheba_number"
                  value={form.sheba_number}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="شماره شبا بانک"
                />
              ) : (
                <p className="text-gray-900">{user.sheba_number || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شماره کارت:</label>
              {isEditing ? (
                <input
                  name="card_number"
                  value={form.card_number}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="شماره کارت بانکی"
                />
              ) : (
                <p className="text-gray-900">{user.card_number || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شماره حساب:</label>
              {isEditing ? (
                <input
                  name="account_number"
                  value={form.account_number}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="شماره حساب بانکی"
                />
              ) : (
                <p className="text-gray-900">{user.account_number || 'تعریف نشده'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">نام بانک:</label>
              {isEditing ? (
                <input
                  name="account_bank"
                  value={form.account_bank}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="نام بانک"
                />
              ) : (
                <p className="text-gray-900">{user.account_bank || 'تعریف نشده'}</p>
              )}
            </div>
          </div>
        </div>

        {/* وضعیت حساب */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">وضعیت حساب</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-600 mr-2">وضعیت تایید:</label>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  user.is_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {user.is_verified ? 'تایید شده' : 'تایید نشده'}
              </span>
            </div>

            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-600 mr-2">وضعیت فعال:</label>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {user.is_active ? 'فعال' : 'غیرفعال'}
              </span>
            </div>

            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-600 mr-2">ثبت نام شده:</label>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  user.is_register ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {user.is_register ? 'بله' : 'خیر'}
              </span>
            </div>

            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-600 mr-2">ضمانت کار:</label>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  user.work_guarantee ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {user.work_guarantee ? 'دارد' : 'ندارد'}
              </span>
            </div>
          </div>
        </div>

        {/* فایل‌ها و تصاویر */}
        <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">مدارک و تصاویر فروشگاه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">جواز کسب:</label>
              {user.business_license && (
                <a href={user.business_license} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">مشاهده تصویر فعلی</a>
              )}
              <input
                type="file"
                name="business_license"
                onChange={handleFileChange}
                accept="image/*"
                disabled={!isEditing}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">تصویر فروشگاه (سرتیتر):</label>
              {user.head_store_image && (
                <a href={user.head_store_image} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">مشاهده تصویر فعلی</a>
              )}
              <input
                type="file"
                name="head_store_image"
                onChange={handleFileChange}
                accept="image/*"
                disabled={!isEditing}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">تصویر ویترین فروشگاه:</label>
              {user.store_window_image && (
                <a href={user.store_window_image} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">مشاهده تصویر فعلی</a>
              )}
              <input
                type="file"
                name="store_window_image"
                onChange={handleFileChange}
                accept="image/*"
                disabled={!isEditing}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">تصویر چک ضمانت:</label>
              {user.Warranty_check_image && (
                <a href={user.Warranty_check_image} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">مشاهده تصویر فعلی</a>
              )}
              <input
                type="file"
                name="Warranty_check_image"
                onChange={handleFileChange}
                accept="image/*"
                disabled={!isEditing}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;