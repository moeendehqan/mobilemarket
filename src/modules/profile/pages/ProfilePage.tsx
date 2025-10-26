import useUser from '../../auth/Hooks/useUser';

const ProfilePage = () => {
  const { data: user, isLoading } = useUser();

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
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">اطلاعات پروفایل</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* اطلاعات شخصی */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">اطلاعات شخصی</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">نام:</label>
              <p className="text-gray-900">{user.first_name || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">نام خانوادگی:</label>
              <p className="text-gray-900">{user.last_name || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">نام کاربری:</label>
              <p className="text-gray-900">{user.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">ایمیل:</label>
              <p className="text-gray-900">{user.email || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شماره موبایل:</label>
              <p className="text-gray-900">{user.mobile || 'تعریف نشده'}</p>
            </div>
          </div>
        </div>

        {/* اطلاعات آدرس */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">اطلاعات آدرس</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">آدرس:</label>
              <p className="text-gray-900">{user.address || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شهر:</label>
              <p className="text-gray-900">{user.city || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شرکت:</label>
              <p className="text-gray-900">{user.company || 'تعریف نشده'}</p>
            </div>
          </div>
        </div>

        {/* اطلاعات بانکی */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">اطلاعات بانکی</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">شماره شبا:</label>
              <p className="text-gray-900">{user.sheba_number || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شماره کارت:</label>
              <p className="text-gray-900">{user.card_number || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">شماره حساب:</label>
              <p className="text-gray-900">{user.account_number || 'تعریف نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">نام بانک:</label>
              <p className="text-gray-900">{user.account_bank || 'تعریف نشده'}</p>
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
      </div>
    </div>
  );
};

export default ProfilePage;
