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
    BookOpen, Palette, Lightbulb, Heart, Camera, Music, HandHeart, Sparkles,
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
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] font-serif py-10 md:py-14">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-lg px-4"
            >
                <Card className="p-6 md:p-8 border border-[#B87333]/10 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-3 right-4 text-[#B87333]/10 text-4xl font-serif">✦</div>

                    <div className="text-center space-y-3 md:space-y-4 mb-6">
                        <div className="w-14 h-14 mx-auto flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-2xl font-normal">
                            A
                        </div>
                        <div>
                            <span className="inline-block px-3 py-0.5 border border-[#B87333]/20 text-[#B87333] font-serif text-[10px] tracking-[0.15em] uppercase">
                                ✦ Begin Your Journey
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B]">
                            Join <span className="text-[#B87333] font-normal">Adyom</span> Foundation
                        </h1>
                        <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B]">
                            Become part of our heritage community
                        </p>
                    </div>

                    {error && (
                        <div className="border border-[#B87333]/20 bg-[#B87333]/5 text-[#B87333] px-4 py-2.5 text-sm font-serif font-light mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-1.5">
                                Full Name <span className="text-[#B87333]">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your full name"
                                    className="pl-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-1.5">
                                Email Address <span className="text-[#B87333]">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="pl-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-1.5">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 XXX-XXX-XXXX"
                                    className="pl-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-1.5">
                                    Password <span className="text-[#B87333]">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                    <Input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min 6 characters"
                                        className="pl-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-1.5">
                                    Confirm Password <span className="text-[#B87333]">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                    <Input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Confirm password"
                                        className="pl-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-2">
                                Your Interests
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {interestOptions.map((opt) => (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => toggleInterest(opt.key)}
                                        className={`px-3 py-2 text-[10px] md:text-xs font-serif font-light transition-all duration-300 border flex items-center gap-2 ${formData.interests.includes(opt.key)
                                                ? 'bg-[#C9A96E] border-[#C9A96E] text-[#3C2F2B]'
                                                : 'bg-[#FDFBF7] border-[#B87333]/20 text-[#6B5B4B] hover:border-[#B87333]/50'
                                            }`}
                                    >
                                        <opt.icon className="w-3 h-3" /> {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs font-serif font-light text-[#8F6B5A] hover:text-[#B87333] transition-colors duration-300 flex items-center gap-1.5"
                            >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {showPassword ? 'Hide Password' : 'Show Password'}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base py-2.5 transition-all duration-300"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#3C2F2B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <ArrowRight className="mr-2 w-4 h-4" /> Sign Up
                                </span>
                            )}
                        </Button>
                    </form>

                    <Separator className="my-5 bg-[#B87333]/10" />

                    <p className="text-center text-xs md:text-sm font-serif font-light text-[#6B5B4B]">
                        Already a member?{' '}
                        <Link to="/login" className="text-[#B87333] hover:text-[#8F6B5A] font-medium transition-colors duration-300">
                            Log In →
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}