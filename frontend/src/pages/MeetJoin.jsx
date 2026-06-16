import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Video, LogIn, ExternalLink } from 'lucide-react';
import { communityAPI } from '@/api';

export default function MeetJoin() {
    const { meetId } = useParams();
    const [searchParams] = useSearchParams();
    const meetUrl = searchParams.get('url') || '';
    const meetTitle = searchParams.get('title') || 'Community Meet';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await communityAPI.meetJoin({
                ...formData,
                meetId,
                meetTitle
            });
            // Redirect to actual meeting URL
            if (meetUrl) {
                window.location.href = meetUrl;
            } else {
                setError('Meeting URL is not available. Please contact your administrator.');
                setLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join meet. Please try again.');
            setLoading(false);
        }
    };

    const handleSkip = () => {
        if (meetUrl) {
            window.location.href = meetUrl;
        } else {
            setError('Meeting URL is not available.');
        }
    };

    return (
        <div className="min-h-screen bg-heritage-creamLight flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-5 mandala-bg pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-heritage-gold/20 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 mx-auto bg-heritage-gold/20 rounded-full flex items-center justify-center mb-4">
                            <Video className="w-8 h-8 text-heritage-terracottaDark" />
                        </div>
                        <Badge variant="outlineGold" className="mb-2 mx-auto w-max">Drishti Wellness</Badge>
                        <CardTitle className="text-2xl font-heading text-heritage-terracottaDark">
                            {decodeURIComponent(meetTitle)}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            Please provide your details to join this session. This helps us track attendance for your organization.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleJoin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                <Input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    className="focus-visible:ring-heritage-gold"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                <Input 
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                    required
                                    className="focus-visible:ring-heritage-gold"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Organization / Company</label>
                                <Input 
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="focus-visible:ring-heritage-gold"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                                    {error}
                                </p>
                            )}

                            <div className="pt-2 flex flex-col gap-3">
                                <Button 
                                    type="submit" 
                                    variant="gold" 
                                    className="w-full h-11 text-base"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <LogIn className="w-5 h-5 mr-2" />
                                    )}
                                    {loading ? 'Joining...' : (meetUrl.includes('whatsapp.com') ? 'Register & Join WhatsApp Group' : 'Register & Join Meeting')}
                                </Button>
                                
                                <button 
                                    type="button"
                                    onClick={handleSkip}
                                    className="text-sm text-gray-500 hover:text-heritage-terracottaDark transition-colors flex items-center justify-center gap-1 mt-1"
                                >
                                    Skip and join directly <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                
                <p className="text-center text-xs text-gray-400 mt-6 font-body">
                    By joining, you agree to our terms. For corporate privacy policies, use the skip option.
                </p>
            </motion.div>
        </div>
    );
}
