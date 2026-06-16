import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight,
    BookOpen, Palette, Lightbulb, Heart, Camera, Music, HandHeart,
} from 'lucide-react';

const interestOptions = [
    { key: 'painting', label: 'Art & Painting', icon: Palette },
    { key: 'mindfulness', label: 'Mindfulness', icon: Lightbulb },
    { key: 'heritage', label: 'Heritage Preservation', icon: Heart },
    { key: 'sculpture', label: 'Photography & Sculpture', icon: Camera },
    { key: 'textile', label: 'Craft & Handwork', icon: HandHeart },
    { key: 'community', label: 'Music & Community', icon: Music },
];

export default function Register() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', phone: '', interests: [],
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const toggleInterest = (key) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(key)
                ? prev.interests.filter(i => i !== key)
                : [...prev.interests, key],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                interests: formData.interests,
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-heritage-creamLight py-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg px-4">
                <Card className="p-8 heritage-border relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-heritage-gold/20 text-4xl font-heading">❋</div>

                    <div className="text-center space-y-4 mb-6">
                        <div className="w-12 h-12 mx-auto rounded-full bg-heritage-terracotta flex items-center justify-center text-heritage-gold font-heading text-xl font-bold">A</div>
                        <Badge variant="outlineGold" className="text-sm px-4 py-1">✦ Begin Your Journey</Badge>
                        <h1 className="text-2xl font-heading font-bold text-heritage-terracottaDark">Join Adyom Foundation</h1>
                        <p className="font-body text-text-main">Become part of our heritage community</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-body mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" className="pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXX-XXX-XXXX" className="pl-10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                    <Input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" className="pl-10" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                    <Input required type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm password" className="pl-10" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-2">Your Interests</label>
                            <div className="grid grid-cols-2 gap-2">
                                {interestOptions.map((opt) => (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => toggleInterest(opt.key)}
                                        className={`px-3 py-2 rounded-md text-xs font-body font-medium transition-all flex items-center gap-2 ${formData.interests.includes(opt.key)
                                                ? 'bg-heritage-terracotta text-heritage-cream'
                                                : 'bg-heritage-cream text-text-main hover:bg-heritage-creamDark border border-heritage-creamDark'
                                            }`}
                                    >
                                        <opt.icon className="w-3 h-3" /> {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button variant="gold" size="lg" type="submit" disabled={loading} className="w-full">
                            {loading ? 'Creating Account...' : <><ArrowRight className="mr-2 w-4 h-4" /> Join Adyom</>}
                        </Button>
                    </form>

                    <Separator className="my-6" />

                    <p className="text-center text-sm font-body text-text-main">
                        Already a member?{' '}
                        <Link to="/login" className="text-heritage-gold hover:text-heritage-goldLight font-semibold">
                            Log In →
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}