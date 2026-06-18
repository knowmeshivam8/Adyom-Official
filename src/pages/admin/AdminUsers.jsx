import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Search, Filter, Eye, Edit, Trash2, Ban,
    CheckCircle2, Mail, Phone, Calendar, Shield,
    UserPlus, Download, ChevronLeft, ChevronRight,
    MoreHorizontal, ArrowUpDown, XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AdminTableSkeleton } from '@/components/ui/page-skeletons';
import { userAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', role: 'member', status: 'active', joined: 'Jan 15, 2026', programs: 3, artworks: 5, lastActive: '2 hours ago', interests: ['Painting', 'Folk Art', 'Mindfulness'] },
    { id: 2, name: 'Anita Desai', email: 'anita@example.com', phone: '+91 87654 32109', role: 'member', status: 'active', joined: 'Feb 10, 2026', programs: 2, artworks: 3, lastActive: '1 day ago', interests: ['Mindfulness', 'Wellness'] },
    { id: 3, name: 'Ravi Bhil', email: 'ravi@example.com', phone: '+91 76543 21098', role: 'member', status: 'active', joined: 'Mar 5, 2026', programs: 1, artworks: 8, lastActive: '5 hours ago', interests: ['Folk Art', 'Warli'] },
    { id: 4, name: 'Lakshmi Rao', email: 'lakshmi@example.com', phone: '+91 65432 10987', role: 'member', status: 'inactive', joined: 'Apr 20, 2026', programs: 0, artworks: 0, lastActive: '2 weeks ago', interests: ['Textile Art'] },
    { id: 5, name: 'Admin User', email: 'admin@adyom.org', phone: '+91 54321 09876', role: 'admin', status: 'active', joined: 'Dec 1, 2025', programs: 0, artworks: 0, lastActive: '10 min ago', interests: [] },
    { id: 6, name: 'Meena Iyer', email: 'meena@example.com', phone: '+91 43210 98765', role: 'member', status: 'active', joined: 'May 12, 2026', programs: 1, artworks: 2, lastActive: '3 hours ago', interests: ['Art Therapy', 'Wellness'] },
    { id: 7, name: 'Arun Kumar', email: 'arun@example.com', phone: '+91 32109 87654', role: 'member', status: 'suspended', joined: 'May 30, 2026', programs: 0, artworks: 0, lastActive: 'Never', interests: ['Painting'] },
    { id: 8, name: 'Sujata Das', email: 'sujata@example.com', phone: '+91 21098 76543', role: 'member', status: 'active', joined: 'Jan 25, 2026', programs: 2, artworks: 4, lastActive: '1 hour ago', interests: ['Madhubani', 'Folk Art'] },
    { id: 9, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 10987 65432', role: 'member', status: 'active', joined: 'Feb 28, 2026', programs: 4, artworks: 6, lastActive: '30 min ago', interests: ['Miniature Painting', 'Painting'] },
    { id: 10, name: 'Kavita Nair', email: 'kavita@example.com', phone: '+91 09876 54321', role: 'member', status: 'active', joined: 'Mar 15, 2026', programs: 2, artworks: 3, lastActive: '4 hours ago', interests: ['Art Therapy'] },
];

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDetail, setShowUserDetail] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await userAPI.getAll({ search, role: filterRole !== 'all' ? filterRole : undefined, status: filterStatus !== 'all' ? filterStatus : undefined, page: currentPage });
                const apiUsers = res.data.data || [];
                setUsers(apiUsers.map(u => ({
                    id: u._id || u.id,
                    name: u.name || 'Unknown',
                    email: u.email || '',
                    phone: u.phone || '',
                    role: u.role || 'member',
                    status: u.status || 'active',
                    joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                    programs: u.enrolledPrograms?.length || 0,
                    artworks: u.artworksCount || 0,
                    lastActive: u.lastActive || 'Recently',
                    interests: u.interests || [],
                    avatar: u.avatar || u.profileImage || null,
                })));
            } catch (err) {
                console.error('Failed to fetch users, using fallback:', err);
                setUsers(fallbackUsers);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [search, filterRole, filterStatus, currentPage]);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const roleCounts = {
        all: users.length,
        member: users.filter(u => u.role === 'member').length,
        admin: users.filter(u => u.role === 'admin').length,
    };

    const statusCounts = {
        all: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        suspended: users.filter(u => u.status === 'suspended').length,
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <Badge variant="success" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
            case 'inactive': return <Badge variant="warning" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
            case 'suspended': return <Badge variant="danger" className="text-xs"><Ban className="w-3 h-3 mr-1" />Suspended</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <Badge variant="gold" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
            case 'member': return <Badge variant="outline" className="text-xs">Member</Badge>;
            default: return <Badge variant="outline">{role}</Badge>;
        }
    };

    if (loading) {
        return <AdminTableSkeleton rows={8} filters={4} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Users className="w-6 h-6 text-heritage-gold" />
                            User Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage members, admins, and user accounts</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlineGold" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Export
                        </Button>
                        <Button variant="gold" size="sm">
                            <UserPlus className="w-4 h-4 mr-1" /> Add User
                        </Button>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Stats */}
            <motion.div {...fadeInUp}>
                <div className="grid md:grid-cols-4 gap-4">
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-muted-foreground">Total Users</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{statusCounts.active}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{statusCounts.inactive}</p><p className="text-xs text-muted-foreground">Inactive</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{statusCounts.suspended}</p><p className="text-xs text-muted-foreground">Suspended</p></CardContent></Card>
                </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Role:</span>
                        {Object.entries(roleCounts).map(([role, count]) => (
                            <Button key={role} variant={filterRole === role ? 'default' : 'outline'} size="sm" onClick={() => setFilterRole(role)} className="capitalize text-xs">
                                {role} ({count})
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Status:</span>
                        {['all', 'active', 'inactive', 'suspended'].map(status => (
                            <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(status)} className="capitalize text-xs">
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Users Table */}
            <motion.div {...fadeInUp}>
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Joined</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Programs</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Last Active</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        {user.avatar ? <AvatarImage src={user.avatar} /> : null}
                                                        <AvatarFallback className="bg-heritage-terracotta text-text-main text-xs">{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                                            <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">{user.joined}</td>
                                            <td className="px-4 py-3 text-xs text-center">{user.programs}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastActive}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedUser(user); setShowUserDetail(true); }}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        {user.status === 'suspended' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Ban className="w-4 h-4 text-red-500" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing {filteredUsers.length} of {users.length} users</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* User Detail Modal */}
            {showUserDetail && selectedUser && (
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>User Details</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowUserDetail(false)}>
                                    <XCircle className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    {selectedUser.avatar ? <AvatarImage src={selectedUser.avatar} /> : null}
                                    <AvatarFallback className="bg-heritage-terracotta text-text-main text-xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getRoleBadge(selectedUser.role)}
                                        {getStatusBadge(selectedUser.status)}
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{selectedUser.email}</span></div>
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{selectedUser.phone}</span></div>
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Joined {selectedUser.joined}</span></div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm"><span className="text-muted-foreground">Programs:</span> <span className="font-medium">{selectedUser.programs}</span></p>
                                    <p className="text-sm"><span className="text-muted-foreground">Artworks:</span> <span className="font-medium">{selectedUser.artworks}</span></p>
                                    <p className="text-sm"><span className="text-muted-foreground">Last Active:</span> <span className="font-medium">{selectedUser.lastActive}</span></p>
                                </div>
                            </div>
                            {selectedUser.interests.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Interests:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedUser.interests.map(i => <Badge key={i} variant="outline" className="text-xs">{i}</Badge>)}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-2 pt-2">
                                <Button variant="default" size="sm"><Edit className="w-4 h-4 mr-1" /> Edit User</Button>
                                <Button variant="outlineGold" size="sm"><Mail className="w-4 h-4 mr-1" /> Send Email</Button>
                                {selectedUser.status === 'suspended' ? (
                                    <Button variant="outline" size="sm" className="text-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> Activate</Button>
                                ) : (
                                    <Button variant="outline" size="sm" className="text-red-600"><Ban className="w-4 h-4 mr-1" /> Suspend</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
