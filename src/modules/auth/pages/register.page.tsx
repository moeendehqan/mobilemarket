import LoginLayout from "../../../layouts/login.layout";
import { RegisterForm } from "../components";

const RegisterPage: React.FC = () => {
  return (
    <LoginLayout>
      <RegisterForm />
    </LoginLayout>
  );
};

export default RegisterPage;
