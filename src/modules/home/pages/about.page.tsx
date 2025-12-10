import { Link } from "react-router-dom";

const AboutPage = () => {
  const features = [
    { title: "مدیریت اگهی‌ها", desc: "ثبت، ویرایش و مشاهده اگهی‌های محصولات با جزئیات کامل." },
    { title: "پیگیری سفارش‌ها", desc: "مشاهده سفارش‌های دریافتی و ارسالی و وضعیت آن‌ها." },
    { title: "جزئیات محصول", desc: "نمایش جزئیات فنی، وضعیت و تصاویر هر محصول." },
    { title: "فیلتر و جستجو", desc: "فیلتر پیشرفته بر اساس وضعیت، نوع و درجه محصول." },
    { title: "پروفایل کاربر", desc: "مدیریت اطلاعات کاربری و مشاهده کیف پول." },
    { title: "رزرو محصول", desc: "نمایش قابلیت رزرو و شمارش معکوس رزرو تا موعد تعیین‌شده." },
  ];

  const faqs = [
    {
      q: "چطور اگهی جدید ثبت کنم؟",
      a: "از مسیر «محصولات > افزودن محصول» می‌توانید اطلاعات محصول را ثبت و منتشر کنید.",
    },
    {
      q: "اگهی‌های خودم را کجا ببینم؟",
      a: "در صفحه «اگهی‌های من» همه محصولات ثبت‌شده توسط شما نمایش داده می‌شوند.",
    },
    {
      q: "چطور جزئیات یک محصول را ببینم؟",
      a: "روی کارت محصول کلیک کنید تا به صفحه جزئیات همان محصول هدایت شوید.",
    },
    {
      q: "آیا امکان جستجو و فیلتر وجود دارد؟",
      a: "بله، در لیست محصولات و اگهی‌های شما امکان جستجو و فیلتر فراهم است.",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">درباره موبایل مارکت</h1>
          <p className="text-gray-600 leading-7">
            موبایل مارکت یک پلتفرم برای مدیریت و انتشار اگهی‌های فروش موبایل است. شما می‌توانید
            محصولات خود را ثبت کنید، وضعیت آن‌ها را مدیریت کنید، سفارش‌ها را ببینید و با کاربران تعامل داشته باشید.
            هدف ما ساده‌سازی فرآیند فروش و خرید با رابط کاربری روان و ابزارهای کاربردی است.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">امکانات کلیدی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">راهنمای شروع سریع</h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-gray-700">
              به صفحه{" "}
              <Link to="/products/me" className="text-blue-600 hover:underline">
                اگهی‌های من
              </Link>{" "}
              بروید تا محصولات ثبت‌شده خود را ببینید.
            </li>
            <li className="text-gray-700">
              برای افزودن محصول جدید، به{" "}
              <Link to="/products/add" className="text-blue-600 hover:underline">
                افزودن محصول
              </Link>{" "}
              مراجعه کنید.
            </li>
            <li className="text-gray-700">
              برای مشاهده جزئیات هر محصول، روی کارت آن کلیک کنید تا به مسیر{" "}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">/products/:id</span> هدایت شوید.
            </li>
            <li className="text-gray-700">
              سفارش‌ها را از مسیر{" "}
              <Link to="/orders" className="text-blue-600 hover:underline">
                سفارش‌ها
              </Link>{" "}
              مشاهده و پیگیری کنید.
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">سوالات متداول</h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-1">{item.q}</p>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">تماس و پشتیبانی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">ایمیل پشتیبانی</p>
              <p className="text-gray-800 font-medium">support@mobilemarket.example</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">شماره تماس</p>
              <p className="text-gray-800 font-medium">+98 912 000 0000</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">آخرین به‌روزرسانی</p>
              <p className="text-gray-800 font-medium">
                {new Date().toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;