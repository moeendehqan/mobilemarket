# MobileMarket

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## فیلد قیمت مشتری (customer_price)
- منظور: قیمت نهایی برای فروش به مشتری
- تفاوت با `price`: قیمت همکار برای معاملات داخلی/همکاران
- نمایش:
  - فرم افزودن محصول: فیلدهای «قیمت همکار» و «قیمت مشتری»
  - لیست محصولات و اگهی‌های من: هر دو قیمت با برچسب‌های مشخص
  - صفحه جزئیات محصول: هر دو قیمت
- اعتبارسنجی: هر دو فیلد الزامی و باید عدد مثبت باشند
- API: سرویس ایجاد محصول (`POST /api/store/product/`) فیلد `customer_price` را دریافت می‌کند

### تست‌ها
- برای اجرای تست‌ها پیشنهاد می‌شود Vitest اضافه شود:

## فیلدهای جدید (New Fields)

### فیلد وضعیت رجیستری (registered)
- نوع: بولین (Boolean)
- مقدار پیش‌فرض: `true` (رجیستر شده)
- کاربرد: مشخص می‌کند که آیا دستگاه در سامانه همتا ثبت شده است یا خیر.
- نمایش:
  - فرم افزودن/ویرایش: چک‌باکس "رجیستر شده"
  - لیست محصولات: فیلتر "رجیستر شده" و نشانگر وضعیت در کارت محصول
  - جزئیات محصول: نمایش وضعیت در بخش مشخصات اصلی

### فیلد سایکل شارژ (charge_cicle)
- نوع: عدد صحیح (Integer)
- مقدار پیش‌فرض: `0`
- محدوده مجاز: 0 تا 999
- کاربرد: نمایش تعداد دفعات شارژ کامل باتری (برای دستگاه‌های کارکرده اهمیت دارد).
- نمایش:
  - فرم افزودن/ویرایش: فیلد عددی با اعتبارسنجی محدوده
  - کارت محصول: نمایش عدد سایکل
  - جزئیات محصول: نمایش در بخش وضعیت باتری
- اعتبارسنجی: الزامی، باید عدد مثبت و کمتر از 1000 باشد.
