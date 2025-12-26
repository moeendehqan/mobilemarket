import { useState } from 'react';
import type { MenuItem } from '../types';
import { BiHomeAlt, BiPackage, BiCart, BiInfoCircle, BiPhone, BiChevronLeft, BiMenu, BiWallet, BiUser } from 'react-icons/bi';
import useUser from '../../auth/Hooks/useUser';
import { Link } from 'react-router-dom';
import BalanceView from '../../accounting/components/balanceVeiw';



interface MenuFeatureProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const MenuFeature = ({ isOpen = true, onToggle }: MenuFeatureProps) => {
  const { data: user } = useUser();
  const [activeItem, setActiveItem] = useState<number>(1);
  const data: MenuItem[] = [
    {
      id: 1,
      name: 'خانه',
      path: '/',
      icon: <BiHomeAlt />,
      children: null,
      is_active: true,
    },
    {
      id: 3,
      name: 'محصولات',
      path: '/',
      icon: <BiPackage />,
      children: null,
      is_active: true,
    },
    {
      id: 4,
      name: 'سفارشات',
      path: '/orders',
      icon: <BiCart />,
      children: null,
      is_active: true,
    },
    {
      id: 5,
      name: 'اگهی های من',
      path: '/productme',
      icon: <BiUser />,
      children: null,
      is_active: true,
    },
    {
      id: 5,
      name: 'کیف پول',
      path: '/wallet',
      icon: <BiWallet />,
      children: null,
      is_active: true,
    },
    {
      id: 6,
      name: 'درباره ما',
      path: '/about',
      icon: <BiInfoCircle />,
      children: null,
      is_active: true,
    },
    {
      id: 7,
      name: 'تماس با ما',
      path: '/contact',
      icon: <BiPhone />,
      children: null,
      is_active: true,
    },
  ];

  const handleItemClick = (id: number) => {
    setActiveItem(id);
  };

  return (
    <>
      {/* Mobile menu button - always visible on mobile */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-60 bg-white rounded-full p-2 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
        <BiMenu className="text-gray-600" />
      </button>

      <div className={`fixed top-0 right-0 h-full z-50 ${!isOpen ? 'lg:block hidden' : ''}`}>
        <div
          className={`h-full bg-white border-l border-gray-200 transition-all duration-300 ease-in-out shadow-lg 
                    ${isOpen ? 'w-64' : 'w-20'} relative`}>
          {/* Desktop toggle button */}
          <button
            onClick={onToggle}
            className="hidden lg:block absolute -left-3 top-6 bg-white rounded-full p-1.5 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
            <BiChevronLeft
              className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-600`}
            />
          </button>

          <div className="p-4">
            <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} mb-8`}>
              {isOpen && <h2 className="text-xl font-bold text-gray-800">موبایل مارکت</h2>}
              <BiMenu className="text-2xl text-gray-600" />
            </div>

            <nav className="space-y-2">
              {data
                .filter((item) => item.is_active)
                .map((item) => (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg
                                    ${
                                      activeItem === item.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }
                                    transition-all duration-200 group relative`}>
                    <div className="text-xl">{item.icon}</div>
                    {isOpen && <span className="mr-3 text-sm font-medium">{item.name}</span>}
                    {!isOpen && (
                      <div
                        className="absolute right-14 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 invisible
                                        group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </a>
                ))}
            </nav>
          </div>

          {isOpen && (
            <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-200">
              <Link
                to={`/profile`}
                className="flex items-center gap-2 space-x-reverse hover:bg-slate-50 p-2 rounded-lg transition-all duration-200">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.first_name || ''} {user?.last_name || ''}
                  </p>
                  <p className="text-xs text-gray-500">{user?.company || ''}</p>
                </div>
                <BalanceView /> 
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuFeature;
