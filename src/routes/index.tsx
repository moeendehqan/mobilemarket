import { createBrowserRouter } from 'react-router-dom';
import {
  LoginPage,
  RegisterPage,
  CustomerPage,
  CustomerDetailPage,
  ProductPage,
  AddProductPage,
  OrdersPage,
} from '../modules';
import App from '../App';
import DetailProductPage from '../modules/products/pages/detail-product.page';
import OrderDetailPage from '../modules/order/pages/order-detail.page';
import StatisticPage from '../modules/home/pages/statistic.page';
import ProfilePage from '../modules/profile/pages/ProfilePage';
import WalletPage from '../modules/wallet/pages/WalletPage';
import ProductMePage from '../modules/products/pages/product-me.page';
import AboutPage from '../modules/home/pages/about.page';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'wallet',
        element: <WalletPage />,
      },
      {
        path: 'stats',
        element: <StatisticPage />,
      },
      {
        path: 'productme',
        element: <ProductMePage />,
      },
      {
        path: 'customers',
        element: <CustomerPage />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '',
        element: <ProductPage />,
      },
      {
        path: 'products/add',
        element: <AddProductPage />,
      },
      {
        path: 'products/:id',
        element: <DetailProductPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'orders/:id',
        element: <OrderDetailPage />,
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
]);

export default router;
