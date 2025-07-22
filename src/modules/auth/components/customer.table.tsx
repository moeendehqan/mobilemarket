import useCustomer from "../Hooks/useCustomer";
import { ReactTabulator } from "react-tabulator";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import ReactDOMServer from "react-dom/server";
import { useNavigate } from "react-router-dom";
import "react-tabulator/lib/styles.css";

const CustomerTable = () => {
  const { getCustomers } = useCustomer();
  const { data: customers } = getCustomers;
  const navigate = useNavigate();

  const detailsButtonHTML = ReactDOMServer.renderToString(
    <button className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm font-medium">
      <BiSolidMessageSquareDetail className="text-base" />
      <span>جزئیات</span>
    </button>
  );

  const columns = [
    { 
      title: "نام", 
      field: "first_name", 
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      headerSort: true,
      width: 150
    },
    { 
      title: "نام خانوادگی", 
      field: "last_name", 
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      headerSort: true,
      width: 150
    },
    { 
      title: "شماره موبایل", 
      field: "mobile", 
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      headerSort: true,
      width: 150,
      formatter: (cell: { getValue: () => any; }) => {
        const value = cell.getValue();
        return value ? value.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1-$2-$3") : "";
      }
    },
    {
      title: "شماره/شناسه ملی",
      field: "uniqidentifier",
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      headerSort: true,
      width: 150
    },
    { 
      title: "شرکت", 
      field: "company", 
      headerFilter: "input",
      headerFilterPlaceholder: "جستجو...",
      headerSort: true,
      width: 150
    },
    {
      title: "ثبت نام",
      field: "is_register",
      formatter: "tickCross",
      headerFilter: "tickCross",
      headerFilterParams: {
        tristate: true
      },
      hozAlign: "center",
      width: 100,
      formatterParams: {
        allowEmpty: true,
        allowTruthy: true,
        tickElement: "<span class='text-green-500'>✓</span>",
        crossElement: "<span class='text-red-500'>✗</span>"
      }
    },
    {
      title: "حسن انجام کار",
      field: "work_guarantee",
      formatter: "tickCross",
      headerFilter: "tickCross",
      headerFilterParams: {
        tristate: true
      },
      hozAlign: "center",
      width: 120,
      formatterParams: {
        allowEmpty: true,
        allowTruthy: true,
        tickElement: "<span class='text-green-500 text-lg'>✓</span>",
        crossElement: "<span class='text-red-500 text-lg'>✗</span>"
      }
    },
    {
      title: "عملیات",
      formatter: () => detailsButtonHTML,
      width: 120,
      hozAlign: "center",
      headerSort: false,
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData();
        navigate(`/customers/${rowData.id}`);
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
    placeholder: "هیچ داده‌ای موجود نیست",
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">لیست مشتریان</h2>
      <div className="overflow-x-auto">
        <ReactTabulator
          data={customers}
          columns={columns as any}
          options={options}
          className="custom-tabulator"
        />
      </div>
    </div>
  );
};

export default CustomerTable;
