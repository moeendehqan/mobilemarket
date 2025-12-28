import { useParams } from "react-router-dom";
import ProductForm from "../components/product.from";

const EditProductPage = () => {
  const { id } = useParams();

  return (
    <>
      <ProductForm productId={id} />
    </>
  );
};

export default EditProductPage;
