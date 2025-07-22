import { useNavigate, useParams } from "react-router-dom";
import CustomerDetail from "../components/customer.detail";




const CustomerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) {
        navigate("/customers");
    }
    else {
        return (
            <div>
                <CustomerDetail id={id} />
            </div>
        )
    }
}


export default CustomerDetailPage;
