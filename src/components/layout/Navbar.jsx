import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ChevronDown,
    User,
    LogOut,
    LayoutDashboard,
    Settings,
    Sparkles,
    Home,
    Info,
    BookOpen,
    Building2,
    Heart,
    Image,
    PenLine,
    Mail,
    Crown,
} from 'lucide-react';

const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    {
        name: 'Programs',
        path: '/programs',
        icon: BookOpen,
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
    { name: 'Corporate & CSR', path: '/corporate', icon: Building2 },
    { name: 'Artisan Connect', path: '/artisan-connect', icon: Heart },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Blog', path: '/blog', icon: PenLine },
    { name: 'Contact', path: '/contact', icon: Mail },
];

// Animation variants
const fadeInDown = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
};

const staggerMenu = {
    animate: {
        transition: { staggerChildren: 0.05 },
    },
};

const menuItem = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
};

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-[#FDFBF7] shadow-lg'
                : 'bg-[#FDFBF7]/95 backdrop-blur-sm shadow-sm'
                }`}
        >
            {/* Heritage top accent line - always visible */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo - Always Dark */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-xl md:text-2xl group-hover:bg-[#B87333] transition-colors duration-300">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-serif font-normal tracking-wide text-[#3C2F2B] group-hover:text-[#B87333] transition-colors duration-300">
                                Adyom
                            </span>
                            <span className="text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase hidden sm:block text-[#8F6B5A]">
                                Foundation
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links - Always Dark */}
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
                                            className={`px-3 py-2 text-sm font-serif font-light transition-all duration-300 flex items-center gap-1 ${location.pathname.startsWith(link.path)
                                                ? 'text-[#B87333] bg-[#B87333]/10'
                                                : 'text-[#3C2F2B] hover:text-[#B87333] hover:bg-[#B87333]/5'
                                                }`}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            {link.name}
                                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''
                                                }`} />
                                        </Link>
                                        <AnimatePresence>
                                            {activeDropdown === link.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-[#FDFBF7] shadow-xl border border-[#B87333]/10 py-2"
                                                >
                                                    {link.submenu.map((sub) => (
                                                        <Link
                                                            key={sub.name}
                                                            to={sub.path}
                                                            className="block px-5 py-2.5 text-sm font-serif font-light text-[#3C2F2B] hover:bg-[#B87333]/5 hover:text-[#B87333] transition-all duration-300"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-[#B87333]/30" />
                                                                {sub.name}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`px-3 py-2 text-sm font-serif font-light transition-all duration-300 flex items-center gap-1 ${location.pathname === link.path
                                            ? 'text-[#B87333] bg-[#B87333]/10'
                                            : 'text-[#3C2F2B] hover:text-[#B87333] hover:bg-[#B87333]/5'
                                            }`}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side: Auth + CTA - Always Dark */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <Link to={dashboardPath}>
                                    <Button
                                        className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white transition-all duration-300 font-serif text-sm px-4 py-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-1.5" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <div className="w-9 h-9 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[#8F6B5A] hover:text-[#B87333] transition-all duration-300 p-1.5"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button
                                        variant="ghost"
                                        className="font-serif font-light text-[#3C2F2B] hover:text-[#B87333] hover:bg-[#B87333]/5 transition-all duration-300"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white transition-all duration-300 font-serif group">
                                        <Sparkles className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform duration-300" />
                                        Join Adyom
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle - Always Dark */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-[#3C2F2B] hover:bg-[#B87333]/10 transition-all duration-300"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Always Dark */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-[#FDFBF7] shadow-2xl border-t border-[#B87333]/10 overflow-hidden"
                    >
                        <motion.div
                            variants={staggerMenu}
                            initial="initial"
                            animate="animate"
                            className="max-w-7xl mx-auto px-4 py-4 space-y-1"
                        >
                            {navLinks.map((link) => (
                                <motion.div key={link.name} variants={menuItem}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-serif font-light text-[#3C2F2B] hover:text-[#B87333] hover:bg-[#B87333]/5 transition-all duration-300"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <link.icon className="w-5 h-5 text-[#B87333]/60" />
                                        {link.name}
                                        {link.submenu && <ChevronDown className="w-4 h-4 ml-auto text-[#B87333]/40" />}
                                    </Link>
                                    {link.submenu && (
                                        <div className="ml-12 space-y-1 border-l-2 border-[#B87333]/20 pl-4">
                                            {link.submenu.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.path}
                                                    className="block px-4 py-2 text-xs font-serif font-light text-[#8F6B5A] hover:text-[#B87333] transition-colors duration-300"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <motion.div variants={menuItem} className="border-t border-[#B87333]/10 pt-4 mt-2 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to={dashboardPath}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-serif font-medium text-[#3C2F2B] hover:text-[#B87333] hover:bg-[#B87333]/5 transition-all duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard className="w-5 h-5 text-[#B87333]/60" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-serif font-light text-[#3C2F2B] hover:text-red-500 hover:bg-red-50 transition-all duration-300 w-full"
                                        >
                                            <LogOut className="w-5 h-5 text-[#B87333]/60" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-serif font-light text-[#3C2F2B] hover:text-[#B87333] hover:bg-[#B87333]/5 transition-all duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className="w-5 h-5 text-[#B87333]/60" />
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button className="w-full bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white transition-all duration-300 font-serif group">
                                                <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>

                            {/* Mobile Footer */}
                            <motion.div variants={menuItem} className="pt-4 text-center">
                                <p className="text-[10px] font-serif text-[#8F6B5A]/50 tracking-wider">
                                    © {new Date().getFullYear()} Adyom Foundation
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
                
                * {
                    font-family: 'Playfair Display', 'Georgia', serif !important;
                }
            `}</style>
        </nav>
    );
}