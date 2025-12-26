import { useState } from 'react';
import MenuFeature from '../modules/menu/components/menu.feature';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 rtl">
            <MenuFeature isOpen={isMenuOpen} onToggle={handleMenuToggle} />
            
            <main 
                className={`transition-all duration-300 ease-in-out
                ${isMenuOpen ? 'lg:mr-64' : 'lg:mr-20'}`}
            >
                <div className="p-4 lg:p-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-4rem)]">
                        <div className="p-4 lg:p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;