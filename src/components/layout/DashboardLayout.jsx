import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    User,
    BookOpen,
    Palette,
    Video,
    Library,
    Users,
    MessageSquare,
    FileText,
    Award,
    Image,
    Calendar,
    Building2,
    Mail,
    Settings,
    LogOut,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    ThumbsUp,
    Eye,
    Sparkles,
    Gift,
    ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';

const memberNav = [
    { name: 'Profile', path: '/dashboard', icon: User },
    { name: 'My Programs', path: '/dashboard/programs', icon: BookOpen },
    { name: 'Pratibimb', path: '/dashboard/pratibimb', icon: Sparkles },
    { name: 'Artwork Upload', path: '/dashboard/artwork', icon: Palette },
    { name: 'Video Submission', path: '/dashboard/videos', icon: Video },
    { name: 'Learning Library', path: '/dashboard/learning', icon: Library },
    { name: 'Community Feed', path: '/dashboard/community', icon: MessageSquare },
    { name: 'Certificates', path: '/dashboard/certificates', icon: Award },
];

const adminNav = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Programs', path: '/admin/programs', icon: BookOpen },
    { name: 'Workshops', path: '/admin/workshops', icon: Calendar },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Artwork Approvals', path: '/admin/artworks', icon: Palette },
    { name: 'Video Approvals', path: '/admin/videos', icon: Video },
    { name: 'Testimonials', path: '/admin/testimonials', icon: ThumbsUp },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Corporate Leads', path: '/admin/corporate', icon: Building2 },
    { name: 'Contact Inquiries', path: '/admin/contact', icon: Mail },
    { name: 'Community', path: '/admin/community', icon: MessageSquare },
    { name: 'Learning', path: '/admin/learning', icon: Library },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Sponsors', path: '/admin/sponsors', icon: Gift },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
];

export default function DashboardLayout() {
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = isAdmin ? adminNav : memberNav;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-heritage-creamLight">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-heritage-terracotta via-heritage-gold to-heritage-terracotta" />

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`${collapsed ? 'w-16' : 'w-64'
                        } bg-heritage-terracotta text-text-main min-h-[calc(100vh-1px)] transition-all duration-300 flex flex-col fixed left-0 top-1 z-40`}
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-heritage-terracottaLight">
                        <div className="flex items-center justify-between">
                            {!collapsed && (
                                <Link to="/" className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-heritage-gold flex items-center justify-center text-text-main font-heading text-sm font-bold">
                                        A
                                    </div>
                                    <span className="font-heading font-bold text-lg text-text-main">
                                        Adyom
                                    </span>
                                </Link>
                            )}
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="p-1 rounded hover:bg-heritage-terracottaLight text-heritage-gold transition-colors"
                            >
                                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* User Info */}
                    {!collapsed && (
                        <div className="p-4 border-b border-heritage-terracottaLight">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-heritage-gold flex items-center justify-center text-text-main font-heading font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-body font-medium text-sm text-text-main">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-text-main font-body font-semibold opacity-80">
                                        {isAdmin ? 'Administrator' : 'Member'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nav Links */}
                    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body transition-all duration-200 ${isActive
                                        ? 'bg-heritage-gold text-text-main font-bold'
                                        : 'text-text-main hover:bg-heritage-terracottaLight/50'
                                        }`}
                                    title={collapsed ? item.name : ''}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-2 border-t border-heritage-terracottaLight space-y-1">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body text-text-main hover:bg-heritage-terracottaLight/50 transition-all"
                            title={collapsed ? 'Back to Site' : ''}
                        >
                            <Eye className="w-4 h-4 flex-shrink-0" />
                            {!collapsed && <span>Back to Site</span>}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body text-text-main hover:bg-red-600 hover:text-white transition-all w-full"
                            title={collapsed ? 'Logout' : ''}
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            {!collapsed && <span>Logout</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`${collapsed ? 'ml-16' : 'ml-64'
                        } flex-1 transition-all duration-300 min-h-[calc(100vh-1px)]`}
                >
                    <div className="p-6 md:p-8 max-w-6xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}