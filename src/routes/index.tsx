import { createBrowserRouter } from 'react-router-dom';
import { LoginPage, RegisterPage, CustomerPage, CustomerDetailPage, ProductPage, AddProductPage, OrdersPage } from '../modules';
import App from '../App';
import DetailProductPage from '../modules/products/pages/detail-product.page';
import OrderDetailPage from '../modules/order/pages/order-detail.page';
import StatisticPage from '../modules/home/pages/statistic.page';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'stats',
        element: <StatisticPage />
      },
      {
        path: 'customers',
        element: <CustomerPage />
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />
      },
      {
        path: '',
        element: <ProductPage />
      },
      {
        path: 'products/add',
        element: <AddProductPage />
      },
      {
        path: 'products/:id',
        element: <DetailProductPage />
      },
      {
        path: 'orders',
        element: <OrdersPage />
      },
      {
        path: 'orders/:id',
        element: <OrderDetailPage />
      }
    ]
  },
  {
    path:'login',
    element: <LoginPage />
  },
  {
    path:'register',
    element: <RegisterPage />
  }
]);

export default router;
