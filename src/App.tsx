import { Outlet } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard.layout';

function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default App
