
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen, theme, onThemeToggle }) => {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fi' : 'en');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm p-4 flex justify-between items-center fixed w-full top-0 left-0 z-50 transition-colors duration-300 print:hidden">
            <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 100 100" className="mr-3 flex-shrink-0" aria-hidden="true">
                    <rect width="100" height="100" rx="20" fill="#4f46e5"/>
                    <text x="50" y="65" fontFamily="Inter, sans-serif" fontSize="50" fill="white" textAnchor="middle" fontWeight="bold">J</text>
                </svg>
                <span className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">Jaakko |</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 font-bold text-sm uppercase hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-10 h-10 flex items-center justify-center"
                    aria-label={`Switch to ${language === 'en' ? 'Finnish' : 'English'}`}
                >
                    {language === 'en' ? 'FI' : 'EN'}
                </button>

                <a 
                    href="/Asiakirja20241229_184155.pdf"
                    download
                    className="inline-flex items-center gap-2 p-2 sm:py-2 sm:px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label={t.header.downloadCv}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span className="hidden sm:inline">{t.header.downloadCv}</span>
                </a>

                {/* Theme Toggle Button */}
                <button 
                    onClick={onThemeToggle}
                    className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={t.header.themeToggle}
                >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    )}
                </button>

                <button 
                    id="menu-toggle" 
                    onClick={onMenuToggle} 
                    className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800"
                    aria-label={isMenuOpen ? t.header.menuClose : t.header.menuOpen}
                    aria-expanded={isMenuOpen}
                    aria-controls="off-canvas-menu"
                >
                    <svg className="w-6 h-6 text-indigo-700 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
