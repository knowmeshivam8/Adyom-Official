import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle2, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userAPI } from '@/api';

export default function PaymentTest() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const programId = searchParams.get('programId');
    const amount = searchParams.get('amount') || '₹0';
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!programId) {
            navigate('/programs');
        }
    }, [programId, navigate]);

    const handleSimulatePayment = async () => {
        setLoading(true);
        // Simulate network delay for payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            // After fake payment succeeds, actually enroll them
            const res = await userAPI.enrollProgram({ programId });
            if (res.data.success) {
                setSuccess(true);
                // Redirect after showing success briefly
                setTimeout(() => {
                    navigate('/dashboard/learning');
                }, 2000);
            }
        } catch (error) {
            console.error('Enrollment error post-payment:', error);
            alert('Payment succeeded but enrollment failed. Please contact support.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                        <p className="text-gray-500 mt-2">You have successfully enrolled in the course.</p>
                    </div>
                    <p className="text-sm text-gray-400">Redirecting to your Learning Dashboard...</p>
                    <Loader2 className="w-6 h-6 animate-spin text-heritage-gold mx-auto" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Cancel and Go Back
                </button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                        <div className="bg-gray-900 p-8 text-white text-center">
                            <ShieldCheck className="w-12 h-12 text-heritage-gold mx-auto mb-4" />
                            <h1 className="text-2xl font-bold">Secure Payment Gateway</h1>
                            <p className="text-gray-400 mt-2">Test Environment</p>
                        </div>
                        
                        <CardContent className="p-8 space-y-8">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Amount to Pay</p>
                                <p className="text-4xl font-bold text-gray-900">{amount}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-700 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <CreditCard className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    <p className="text-sm">This is a simulated testing environment. No real money will be deducted from your account. Click the button below to simulate a successful payment.</p>
                                </div>
                            </div>

                            <Button 
                                variant="gold" 
                                size="xl" 
                                className="w-full text-lg h-14 rounded-xl shadow-lg shadow-heritage-gold/20"
                                onClick={handleSimulatePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5 mr-2" />
                                        Pay {amount} & Complete Enrollment
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" /> Secure 256-bit SSL Encryption
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
