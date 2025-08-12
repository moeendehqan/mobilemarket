import { useNavigate } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import ProductTable from "../components/product.table";

const ProductPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
                <button 
                    onClick={() => navigate('/products/add')} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 rtl:flex-row-reverse"
                >
                    <MdAdd className="text-xl" />
                    <span>ایجاد محصول جدید</span>
                </button>
            </div>
            <ProductTable />
        </div>
    )
}


export default ProductPage;
