// فایل: product-me.page.tsx
// کامپوننت: ProductMePage

import ProductMeTable from "../components/product-me.table";

const ProductMePage = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">اگهی های من</h1>
      <ProductMeTable />
    </div>
  );
};

export default ProductMePage;