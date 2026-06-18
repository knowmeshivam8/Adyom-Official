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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-gradient-to-b from-black/30 to-transparent'
            }`}
        >
            {/* Heritage top accent line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-heritage-gold to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-heritage-gold to-amber-400 flex items-center justify-center text-heritage-brown font-serif text-xl md:text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide drop-shadow-md group-hover:text-heritage-goldLight transition-colors duration-300">
                                Adyom
                            </span>
                            <span className="text-[10px] md:text-xs text-heritage-goldLight/70 font-light tracking-[0.2em] uppercase hidden sm:block">
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
                                            className={`px-3 py-2 text-sm font-light transition-all duration-300 flex items-center gap-1 rounded-lg ${
                                                location.pathname.startsWith(link.path)
                                                    ? 'text-heritage-goldLight bg-white/10 backdrop-blur-sm'
                                                    : scrolled
                                                        ? 'text-heritage-brown hover:text-heritage-gold hover:bg-heritage-gold/10'
                                                        : 'text-white/90 hover:text-heritage-goldLight hover:bg-white/10'
                                            }`}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            {link.name}
                                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                                                activeDropdown === link.name ? 'rotate-180' : ''
                                            }`} />
                                        </Link>
                                        <AnimatePresence>
                                            {activeDropdown === link.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-heritage-gold/20 py-2 overflow-hidden"
                                                >
                                                    {link.submenu.map((sub) => (
                                                        <Link
                                                            key={sub.name}
                                                            to={sub.path}
                                                            className="block px-5 py-2.5 text-sm font-light text-heritage-brown hover:bg-gradient-to-r hover:from-heritage-gold/10 hover:to-transparent hover:text-heritage-gold transition-all duration-300"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold/30" />
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
                                        className={`px-3 py-2 text-sm font-light transition-all duration-300 flex items-center gap-1 rounded-lg ${
                                            location.pathname === link.path
                                                ? 'text-heritage-goldLight bg-white/10 backdrop-blur-sm'
                                                : scrolled
                                                    ? 'text-heritage-brown hover:text-heritage-gold hover:bg-heritage-gold/10'
                                                    : 'text-white/90 hover:text-heritage-goldLight hover:bg-white/10'
                                        }`}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side: Auth + CTA */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <Link to={dashboardPath}>
                                    <Button 
                                        className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-lg transition-all duration-300 font-medium text-sm px-4 py-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-1.5" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-heritage-gold to-amber-400 flex items-center justify-center text-heritage-brown font-serif text-sm font-bold shadow-md">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white/70 hover:text-heritage-goldLight transition-all duration-300 p-1.5 rounded-lg hover:bg-white/10"
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
                                        className={`font-light hover:bg-white/10 transition-all duration-300 ${
                                            scrolled ? 'text-heritage-brown hover:text-heritage-gold' : 'text-white/80 hover:text-white'
                                        }`}
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-lg transition-all duration-300 font-medium group">
                                        <Sparkles className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform duration-300" />
                                        Join Adyom
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                            scrolled ? 'text-heritage-brown hover:bg-heritage-gold/10' : 'text-white hover:bg-white/10'
                        }`}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-white shadow-2xl border-t border-heritage-gold/20 overflow-hidden"
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
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-light text-heritage-brown hover:text-heritage-gold hover:bg-gradient-to-r hover:from-heritage-gold/5 hover:to-transparent rounded-xl transition-all duration-300"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <link.icon className="w-5 h-5 text-heritage-gold/60" />
                                        {link.name}
                                        {link.submenu && <ChevronDown className="w-4 h-4 ml-auto text-heritage-gold/40" />}
                                    </Link>
                                    {link.submenu && (
                                        <div className="ml-12 space-y-1 border-l-2 border-heritage-gold/20 pl-4">
                                            {link.submenu.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.path}
                                                    className="block px-4 py-2 text-xs font-light text-heritage-brownLight hover:text-heritage-gold transition-colors duration-300"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            
                            <motion.div variants={menuItem} className="border-t border-heritage-gold/20 pt-4 mt-2 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to={dashboardPath}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-heritage-brown hover:text-heritage-gold hover:bg-gradient-to-r hover:from-heritage-gold/5 hover:to-transparent rounded-xl transition-all duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard className="w-5 h-5 text-heritage-gold/60" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-light text-heritage-brown hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 w-full"
                                        >
                                            <LogOut className="w-5 h-5 text-heritage-gold/60" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-light text-heritage-brown hover:text-heritage-gold hover:bg-gradient-to-r hover:from-heritage-gold/5 hover:to-transparent rounded-xl transition-all duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className="w-5 h-5 text-heritage-gold/60" />
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button className="w-full bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-lg transition-all duration-300 font-medium group">
                                                <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                                Join Adyom
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                            
                            {/* Mobile Footer */}
                            <motion.div variants={menuItem} className="pt-4 text-center">
                                <p className="text-[10px] text-heritage-brownLight/50 font-light tracking-wider">
                                    © {new Date().getFullYear()} Adyom Foundation
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                /* Custom scrollbar for dropdown */
                .nav-dropdown::-webkit-scrollbar {
                    width: 4px;
                }
                .nav-dropdown::-webkit-scrollbar-track {
                    background: transparent;
                }
                .nav-dropdown::-webkit-scrollbar-thumb {
                    background: #D4A574;
                    border-radius: 2px;
                }
            `}</style>
        </nav>
    );
}