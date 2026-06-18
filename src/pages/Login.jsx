import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, ArrowRight, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                className="w-full max-w-md px-4"
            >
                <Card className="p-6 md:p-8 border border-[#B87333]/10 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-3 right-4 text-[#B87333]/10 text-4xl font-serif">✦</div>

                    <div className="text-center space-y-3 md:space-y-4 mb-6">
                        <div className="w-14 h-14 mx-auto flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-2xl font-normal">
                            A
                        </div>
                        <div>
                            <span className="inline-block px-3 py-0.5 border border-[#B87333]/20 text-[#B87333] font-serif text-[10px] tracking-[0.15em] uppercase">
                                ✦ Welcome Back
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B]">
                            Log In to <span className="text-[#B87333] font-normal">Adyom</span>
                        </h1>
                        <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B]">
                            Continue your heritage journey
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
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="pl-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-serif font-light text-[#3C2F2B] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="pl-9 pr-9 border-[#B87333]/20 font-serif text-sm bg-[#FDFBF7] focus:border-[#B87333] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F6B5A] hover:text-[#B87333] transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
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
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <LogIn className="mr-2 w-4 h-4" /> Log In
                                </span>
                            )}
                        </Button>
                    </form>

                    <Separator className="my-5 bg-[#B87333]/10" />

                    <p className="text-center text-xs md:text-sm font-serif font-light text-[#6B5B4B]">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#B87333] hover:text-[#8F6B5A] font-medium transition-colors duration-300">
                            Join Adyom →
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}