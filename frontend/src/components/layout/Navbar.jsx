import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Menu,
    X,
    ChevronDown,
    User,
    LogOut,
    LayoutDashboard,
    Settings,
} from 'lucide-react';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    {
        name: 'Programs',
        path: '/programs',
        submenu: [
            { name: 'Drishti', path: '/programs?category=drishti' },
            { name: 'Chaitanya', path: '/programs?category=chaitanya' },
            { name: 'Kala-Path', path: '/programs?category=kala-path' },
            { name: 'Sparsh', path: '/programs?category=sparsh' },
            { name: 'Pratibimb', path: '/programs?category=pratibimb' },
            { name: 'Kala-Vritti', path: '/programs?category=kala-vritti' },
            { name: 'Samanvaya', path: '/programs?category=samanvaya' },
            { name: 'Workshops', path: '/programs?category=workshop' },
        ],
    },
    { name: 'Corporate & CSR', path: '/corporate' },
    { name: 'Artisan Connect', path: '/artisan-connect' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { user, isAuthenticated, isMember, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dashboardPath = isAdmin ? '/admin' : '/dashboard';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-heritage-creamLight/98 backdrop-blur-md shadow-lg'
                    : 'bg-heritage-creamLight/80 backdrop-blur-sm'
                }`}
        >
            {/* Heritage top accent line */}
            <div className="h-1 bg-gradient-to-r from-heritage-terracotta via-heritage-gold to-heritage-terracotta" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img src="/images/adyom_logo.png" alt="Adyom Foundation Logo" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-heading font-bold text-heritage-terracottaDark tracking-wide">
                                Adyom
                            </span>
                            <span className="text-xs text-heritage-gold font-accent tracking-widest hidden sm:block">
                                Foundation
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative">
                                {link.submenu ? (
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setActiveDropdown(link.name)}
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        <Link
                                            to={link.path}
                                            className={`px-3 py-2 text-sm font-body font-bold transition-colors duration-200 flex items-center gap-1 ${location.pathname.startsWith(link.path)
                                                    ? 'text-heritage-terracottaDark'
                                                    : 'text-heritage-brown hover:text-heritage-terracottaDark'
                                                }`}
                                        >
                                            {link.name}
                                            <ChevronDown className="w-3 h-3" />
                                        </Link>
                                        {activeDropdown === link.name && (
                                            <div className="absolute top-full left-0 mt-1 w-48 bg-heritage-creamLight shadow-lg rounded-lg border border-heritage-creamDark py-2 animate-fade-in">
                                                {link.submenu.map((sub) => (
                                                    <Link
                                                        key={sub.name}
                                                        to={sub.path}
                                                        className="block px-4 py-2 text-sm font-body font-semibold text-heritage-brown hover:bg-heritage-cream hover:text-heritage-terracottaDark transition-colors"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`px-3 py-2 text-sm font-body font-bold transition-colors duration-200 ${location.pathname === link.path
                                                ? 'text-heritage-terracottaDark'
                                                : 'text-heritage-brown hover:text-heritage-terracottaDark'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side: Auth + CTA */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {isAdmin && (
                                    <Link to="/admin">
                                        <Button variant="gold" size="sm">
                                            <LayoutDashboard className="w-4 h-4 mr-1" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3 bg-heritage-cream px-3 py-1.5 rounded-full border border-heritage-creamDark">
                                    <div className="w-8 h-8 rounded-full bg-heritage-terracotta flex items-center justify-center text-heritage-brown font-heading text-sm font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="font-body font-bold text-sm text-heritage-brown">
                                        Hi, {user?.name?.split(' ')[0]}
                                    </span>
                                    <div className="w-px h-4 bg-heritage-creamDark mx-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-text-main hover:text-heritage-terracottaDark transition-colors p-1"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign In / Sign Up
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="gold" size="sm">
                                        Register for Webinar
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-heritage-terracottaDark hover:text-heritage-gold transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-heritage-creamLight border-t border-heritage-creamDark shadow-lg animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <div key={link.name}>
                                <Link
                                    to={link.path}
                                    className="block px-4 py-3 text-sm font-body font-bold text-heritage-brown hover:text-heritage-terracottaDark hover:bg-heritage-cream rounded-md transition-colors"
                                >
                                    {link.name}
                                </Link>
                                {link.submenu && (
                                    <div className="pl-6 space-y-1">
                                        {link.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                to={sub.path}
                                                className="block px-4 py-2 text-xs font-body text-text-main hover:text-heritage-terracottaDark transition-colors"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="border-t border-heritage-creamDark pt-3 space-y-2">
                            {isAuthenticated ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-3 text-sm font-body font-medium text-heritage-terracottaDark"
                                        >
                                            <LayoutDashboard className="w-4 h-4 inline mr-2" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <div className="px-4 py-3 flex items-center space-x-3 bg-heritage-cream">
                                        <div className="w-8 h-8 rounded-full bg-heritage-terracotta flex items-center justify-center text-heritage-brown font-heading text-sm font-bold">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="font-body font-bold text-sm text-heritage-brown">
                                            Hi, {user?.name?.split(' ')[0]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-3 text-sm font-body font-medium text-text-main w-full text-left border-t border-heritage-creamDark"
                                    >
                                        <LogOut className="w-4 h-4 inline mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-4 py-3 text-sm font-body font-medium text-heritage-brown">
                                        Sign In / Sign Up
                                    </Link>
                                    <Link to="/register" className="block">
                                        <Button variant="gold" size="sm" className="w-full">
                                            Register for Webinar
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}