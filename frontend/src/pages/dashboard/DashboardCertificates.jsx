import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Award, Download, Share2, Eye, Calendar, CheckCircle2,
    Trophy, Star, BookOpen, Palette, Sparkles, Lock,
    ChevronRight, ExternalLink, Printer, Mail, Loader2,
    Layers, Medal, Zap, TrendingUp, Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { certificateAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const certificateTypeConfig = {
    excellence: {
        icon: Star,
        label: 'Excellence',
        gradient: 'from-amber-500 to-yellow-600',
        bgGradient: 'from-amber-50 to-yellow-50',
        borderColor: 'border-amber-200',
    },
    completion: {
        icon: Award,
        label: 'Completion',
        gradient: 'from-heritage-terracotta to-red-800',
        bgGradient: 'from-heritage-terracotta/5 to-heritage-gold/5',
        borderColor: 'border-heritage-gold/20',
    },
    award: {
        icon: Trophy,
        label: 'Award',
        gradient: 'from-purple-600 to-indigo-700',
        bgGradient: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-200',
    },
};

const awardTypeLabels = {
    'max-attendee': 'Max Attendee',
    'max-submission': 'Max Submission',
    'most-innovative': 'Most Innovative',
};

const awardTypeIcons = {
    'max-attendee': Users,
    'max-submission': TrendingUp,
    'most-innovative': Zap,
};

export default function DashboardCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await certificateAPI.getMine();
                const apiCerts = res.data.data || [];
                if (apiCerts.length > 0) {
                    setCertificates(apiCerts.map(cert => ({
                        id: cert._id || cert.id,
                        title: cert.title || cert.program?.title || 'Certificate',
                        program: cert.program?.title || cert.programName || 'Program',
                        programType: cert.program?.programType || '',
                        certificateType: cert.certificateType || 'completion',
                        excellenceLevel: cert.excellenceLevel || null,
                        awardType: cert.awardType || '',
                        issuedDate: cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently',
                        issuedBy: cert.issuedBy?.name || 'Adyom Foundation',
                        credentialId: cert.certificateNumber || cert.credentialId || cert._id || 'ADYOM-CERT',
                        shareable: cert.shareable !== false,
                        skills: cert.skills || ['Art Skills', 'Cultural Knowledge', 'Folk Art Techniques'],
                        description: cert.description || '',
                    })));
                }
            } catch (err) {
                console.log('Using fallback certificates data:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    const excellenceCerts = certificates.filter(c => c.certificateType === 'excellence');
    const completionCerts = certificates.filter(c => c.certificateType === 'completion');
    const awardCerts = certificates.filter(c => c.certificateType === 'award');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
                <span className="ml-3 text-muted-foreground">Loading certificates...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Award className="w-6 h-6 text-heritage-gold" />
                            My Certificates
                        </h1>
                        <p className="text-muted-foreground mt-1">View and share your earned certificates and achievements</p>
                    </div>
                    <Badge variant="gold" className="text-sm">
                        {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''} Earned
                    </Badge>
                </div>
            </motion.div>

            <Separator />

            {/* Stats Overview */}
            <motion.div {...fadeInUp}>
                <div className="grid md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-heritage-terracotta/10 to-heritage-gold/10 border-heritage-gold/30">
                        <CardContent className="p-4 text-center">
                            <Award className="w-8 h-8 text-heritage-gold mx-auto mb-2" />
                            <p className="text-2xl font-bold text-heritage-terracottaDark">{certificates.length}</p>
                            <p className="text-xs text-muted-foreground">Total Certificates</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                        <CardContent className="p-4 text-center">
                            <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-amber-700">{excellenceCerts.length}</p>
                            <p className="text-xs text-muted-foreground">Excellence</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-4 text-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-700">{completionCerts.length}</p>
                            <p className="text-xs text-muted-foreground">Completion</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardContent className="p-4 text-center">
                            <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-purple-700">{awardCerts.length}</p>
                            <p className="text-xs text-muted-foreground">Awards</p>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* Excellence Certificates */}
            {excellenceCerts.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-heading font-semibold text-amber-700 flex items-center gap-2">
                        <Star className="w-5 h-5" /> Excellence Certificates
                    </h2>
                    {excellenceCerts.map((cert) => {
                        const config = certificateTypeConfig.excellence;
                        return (
                            <CertificateCard key={cert.id} cert={cert} config={config}>
                                <Badge variant="gold" className="text-xs">
                                    {cert.excellenceLevel} Modules Completed
                                </Badge>
                            </CertificateCard>
                        );
                    })}
                </div>
            )}

            {/* Completion Certificates */}
            {completionCerts.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-heading font-semibold text-heritage-terracottaDark flex items-center gap-2">
                        <Award className="w-5 h-5" /> Completion Certificates
                    </h2>
                    {completionCerts.map((cert) => {
                        const config = certificateTypeConfig.completion;
                        return <CertificateCard key={cert.id} cert={cert} config={config} />;
                    })}
                </div>
            )}

            {/* Award Certificates */}
            {awardCerts.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-heading font-semibold text-purple-700 flex items-center gap-2">
                        <Trophy className="w-5 h-5" /> Awards
                    </h2>
                    {awardCerts.map((cert) => {
                        const config = certificateTypeConfig.award;
                        const AwardIcon = awardTypeIcons[cert.awardType] || Medal;
                        return (
                            <CertificateCard key={cert.id} cert={cert} config={config}>
                                <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                    <AwardIcon className="w-3 h-3 mr-1" />
                                    {awardTypeLabels[cert.awardType] || cert.awardType}
                                </Badge>
                            </CertificateCard>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {certificates.length === 0 && (
                <motion.div {...fadeInUp}>
                    <div className="text-center py-16">
                        <Award className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground">No certificates yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            Complete program modules and submit your artwork to earn Excellence, Completion, and Award certificates.
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <Button variant="gold">
                                <BookOpen className="w-4 h-4 mr-1" /> Browse Programs
                            </Button>
                            <Button variant="outlineGold">
                                <Sparkles className="w-4 h-4 mr-1" /> Explore Learning Dashboard
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* How to Earn More */}
            <motion.div {...fadeInUp}>
                <Card className="bg-gradient-to-r from-heritage-terracotta/5 to-heritage-gold/5 border-heritage-gold/20">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-heritage-gold" />
                            How to Earn More Certificates
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-white/70">
                                <Star className="w-6 h-6 text-amber-600 mb-2" />
                                <h4 className="font-semibold text-sm text-foreground">Excellence Certificate</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Submit artwork + activity for 3 modules (Level 1) and 6 modules (Level 2).
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/70">
                                <Award className="w-6 h-6 text-heritage-terracottaDark mb-2" />
                                <h4 className="font-semibold text-sm text-foreground">Completion Certificate</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    After completion of videos, you can apply for a completion certificate. (For Offline Training: You will get the certificate after submitting 5 Artworks).
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/70">
                                <Trophy className="w-6 h-6 text-purple-600 mb-2" />
                                <h4 className="font-semibold text-sm text-foreground">Awards</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max Attendee, Max Submission, and Most Innovative awards for top performers.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

// Reusable Certificate Card Component
function CertificateCard({ cert, config, children }) {
    const Icon = config.icon;

    return (
        <motion.div {...fadeInUp}>
            <Card className={`overflow-hidden border ${config.borderColor}`}>
                <div className={`h-24 bg-gradient-to-r ${config.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 left-8 w-16 h-16 rounded-full border-2 border-heritage-gold" />
                        <div className="absolute bottom-2 right-12 w-12 h-12 rounded-full border border-heritage-gold" />
                        <div className="absolute top-4 right-4 w-20 h-20 rounded-full border border-white/30" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <Icon className="w-10 h-10 text-heritage-gold" />
                            <div>
                                <h3 className="text-xl font-bold text-white font-playfair">{cert.title}</h3>
                                <p className="text-sm text-white/80">{config.label} Certificate</p>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Certificate Details</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Program</span>
                                        <span className="text-sm font-medium text-foreground">{cert.program}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <span className="text-sm font-medium capitalize">{cert.certificateType}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Issued By</span>
                                        <span className="text-sm font-medium text-foreground">{cert.issuedBy}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Issued Date</span>
                                        <span className="text-sm font-medium text-foreground">{cert.issuedDate}</span>
                                    </div>
                                    {children && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Level</span>
                                            {children}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Credential ID: {cert.credentialId}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Skills Acquired</h4>
                            <div className="flex flex-wrap gap-2">
                                {cert.skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-sm border-heritage-gold/40 text-heritage-terracottaDark">
                                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-heritage-gold/20">
                        <Button variant="gold" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Download PDF
                        </Button>
                        <Button variant="outlineGold" size="sm">
                            <Share2 className="w-4 h-4 mr-1" /> Share on LinkedIn
                        </Button>
                        <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" /> View Full Certificate
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}