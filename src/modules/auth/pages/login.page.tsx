import LoginLayout from '../../../layouts/login.layout';
import { OtpForm } from '../components';



import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
      <OtpForm />
    </LoginLayout>
  );
};

export default LoginPage;


