import { useNavigate } from "react-router-dom";
import ToolbarLayout from "../../../layouts/toolbar.layout";
import { IoIosAddCircle } from "react-icons/io";
import ProductTable from "../components/product.table";




const ProductPage = () => {

    const navigate = useNavigate();
    
    return (
        <div>
            <ToolbarLayout>
                <p onClick={() => navigate('/products/add')} className="text-2xl cursor-pointer text-blue-500" ><IoIosAddCircle />
                </p>
            </ToolbarLayout>
            <p>sss</p>
            <ProductTable />
        </div>
    )
}


export default ProductPage;
