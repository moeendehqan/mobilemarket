import useProductsList from "../hooks/useProductsList";
import { ReactTabulator } from "react-tabulator";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import ReactDOMServer from "react-dom/server";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product.type";
import "react-tabulator/lib/styles.css";

const formatPrice = (price: string | null) => {
  if (!price) return "";
  return new Intl.NumberFormat('fa-IR').format(parseInt(price)) + " تومان";
};

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('fa-IR');
};

const ProductTable = () => {
  const { data, isLoading, error } = useProductsList();
  const navigate = useNavigate();

  const iconHTML = ReactDOMServer.renderToString(
    <p className="text-2xl text-blue-500 hover:text-blue-700 transition-colors cursor-pointer">
      <BiSolidMessageSquareDetail />
    </p>
  );

  const statusFormatter = (cell: any) => {
    const value = cell.getValue();
    const statusMap: Record<string, { text: string; class: string }> = {
      open: { text: "باز", class: "bg-green-100 text-green-800" },
      saled: { text: "فروخته شده", class: "bg-blue-100 text-blue-800" },
      canseled: { text: "لغو شده", class: "bg-red-100 text-red-800" },
      reserved: { text: "رزرو شده", class: "bg-yellow-100 text-yellow-800" },
    };
    const status = statusMap[value] || { text: "", class: "" };
    return `<span class="px-2 py-1 rounded-full text-sm ${status.class}">${status.text}</span>`;
  };

  const typeFormatter = (cell: any) => {
    const value = cell.getValue();
    const typeMap: Record<string, { text: string; class: string }> = {
      new: { text: "نو", class: "bg-green-100 text-green-800" },
      "as new": { text: "در حد نو", class: "bg-blue-100 text-blue-800" },
      used: { text: "کارکرده", class: "bg-gray-100 text-gray-800" },
    };
    const type = typeMap[value] || { text: "", class: "" };
    return `<span class="px-2 py-1 rounded-full text-sm ${type.class}">${type.text}</span>`;
  };

  const columns = [
    { 
      title: "نام محصول", 
      field: "name", 
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 200
    },
    { 
      title: "برند", 
      field: "brand", 
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 120
    },
    { 
      title: "قیمت", 
      field: "price",
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      formatter: (cell: any) => formatPrice(cell.getValue()),
      width: 150
    },
    { 
      title: "وضعیت", 
      field: "status_product",
      formatter: statusFormatter,
      headerFilter: "select",
      headerFilterParams: {
        values: {
          open: "باز",
          saled: "فروخته شده",
          canseled: "لغو شده",
          reserved: "رزرو شده",
        }
      },
      width: 130
    },
    { 
      title: "نوع محصول", 
      field: "type_product",
      formatter: typeFormatter,
      headerFilter: "select",
      headerFilterParams: {
        values: {
          new: "نو",
          "as new": "در حد نو",
          used: "کارکرده",
        }
      },
      width: 120
    },
    { 
      title: "تاریخ ثبت", 
      field: "created_at",
      formatter: (cell: any) => formatDate(cell.getValue()),
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      width: 120
    },
    {
      title: "جزئیات",
      formatter: () => iconHTML,
      width: 80,
      hozAlign: "center",
      headerSort: false,
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as Product;
        if (rowData.id) {
          navigate(`/products/${rowData.id}`);
        }
      },
    },
  ];

  const options = {
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 50],
    movableColumns: true,
    placeholder: "هیچ محصولی موجود نیست",
    langs: {
      default: {
        pagination: {
          page_size: "تعداد در صفحه",
          first: "اولین",
          first_title: "صفحه اول",
          last: "آخرین",
          last_title: "صفحه آخر",
          prev: "قبلی",
          prev_title: "صفحه قبل",
          next: "بعدی",
          next_title: "صفحه بعد",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">خطا در دریافت اطلاعات</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">لیست محصولات</h1>
      </div>
      <div className="overflow-x-auto">
        <ReactTabulator
          data={data}
          columns={columns}
          options={options}
          className="custom-tabulator"
        />
      </div>
    </div>
  );
};

export default ProductTable;
