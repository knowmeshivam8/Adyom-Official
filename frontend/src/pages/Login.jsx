import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const user = await login(email, password);
                navigate(user.role === 'admin' ? '/admin' : '/');
            } else {
                const user = await register({ name, email, password });
                navigate(user.role === 'admin' ? '/admin' : '/');
            }
        } catch (err) {
            setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-heritage-creamLight py-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md px-4">
                <Card className="p-8 heritage-border relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-heritage-gold/20 text-4xl font-heading">❋</div>

                    <div className="text-center space-y-4 mb-6">
                        <div className="w-12 h-12 mx-auto rounded-full bg-heritage-terracotta flex items-center justify-center text-heritage-gold font-heading text-xl font-bold">A</div>
                        <Badge variant="outlineGold" className="text-sm px-4 py-1">✦ {isLogin ? 'Welcome Back' : 'Begin Your Journey'}</Badge>
                        <h1 className="text-2xl font-heading font-bold text-heritage-terracottaDark">{isLogin ? 'Log In to Adyom' : 'Join Adyom Foundation'}</h1>
                        <p className="font-body text-text-main">Continue your heritage journey</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-body mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                    <Input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="pl-10" />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                <Input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="pl-10 pr-10" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-main hover:text-heritage-terracottaDark">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                                    <Input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="pl-10" />
                                </div>
                            </div>
                        )}
                        <Button variant="gold" size="lg" type="submit" disabled={loading} className="w-full">
                            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (
                                <>{isLogin ? <LogIn className="mr-2 w-4 h-4" /> : <UserPlus className="mr-2 w-4 h-4" />} {isLogin ? 'Log In' : 'Sign Up'}</>
                            )}
                        </Button>
                    </form>

                    <Separator className="my-6" />

                    <p className="text-center text-sm font-body text-text-main">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-heritage-gold hover:text-heritage-goldLight font-semibold">
                            {isLogin ? "Sign Up →" : "Log In →"}
                        </button>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}