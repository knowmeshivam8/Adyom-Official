import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import {
    MapPin,
    Phone,
    Mail,
    Heart,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Clock,
    Globe,
    Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Custom SVG social icons
const Facebook = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.582-5.978.826 0 2.264.164 2.264.164v2.745h-1.264c-1.264 0-1.776.517-1.776 1.575v1.574h3.014l-.404 3.667h-2.61v7.98C18.487 23.143 24 18.324 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.628 3.874 10.35 9.101 11.691Z" />
    </svg>
);

const Instagram = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
);

const Youtube = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
);

const Twitter = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const Linkedin = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const programLinks = [
    { name: 'Drishti', path: '/programs?category=drishti' },
    { name: 'Chaitanya', path: '/programs?category=chaitanya' },
    { name: 'Kala-Path', path: '/programs?category=kala-path' },
    { name: 'Sparsh', path: '/programs?category=sparsh' },
    { name: 'Pratibimb', path: '/programs?category=pratibimb' },
    { name: 'Kala-Vritti', path: '/programs?category=kala-vritti' },
    { name: 'Samanvaya', path: '/programs?category=samanvaya' },
];

const quickLinks = [
    { name: 'About Adyom', path: '/about' },
    { name: 'Corporate & CSR', path: '/corporate' },
    { name: 'Artisan Connect', path: '/artisan-connect' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
];

const socialLinks = [
    { icon: Facebook, label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: Instagram, label: 'Instagram', color: 'hover:bg-[#E4405F]' },
    { icon: Youtube, label: 'YouTube', color: 'hover:bg-[#FF0000]' },
    { icon: Twitter, label: 'Twitter', color: 'hover:bg-[#000000]' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-[#0A66C2]' },
];

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.08 },
    },
};

export default function Footer() {
    return (
        <footer className="relative bg-[#3C2F2B] overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-[0.04]">
                <div className="absolute top-0 left-0 w-64 h-64 border-4 border-[#C9A96E] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-[#C9A96E] rounded-full translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-4 border-[#C9A96E]/50 rounded-full" />

                {/* Floating decorative elements */}
                <motion.div
                    className="absolute top-20 left-20 text-4xl text-[#C9A96E]"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    ✦
                </motion.div>
                <motion.div
                    className="absolute bottom-20 right-20 text-3xl text-[#C9A96E]"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    ✧
                </motion.div>
            </div>

            {/* Heritage Decorative Top Border */}
            <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />

            {/* Main Footer Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
                >
                    {/* Brand Column */}
                    <motion.div variants={fadeInUp} className="space-y-5">
                        <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-2xl">
                                A
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif font-normal text-[#FDFBF7] tracking-wide">
                                    Adyom
                                </h3>
                                <p className="text-[10px] text-[#D4A574] font-serif tracking-[0.2em] uppercase">
                                    Foundation
                                </p>
                            </div>
                        </div>

                        <p className="text-sm font-serif font-light text-[#D4A574] leading-relaxed">
                            Preserving India's timeless heritage through art, mindfulness, and community.
                            Where tradition meets transformation — a canvas of heritage for the modern soul.
                        </p>

                        <div className="flex items-center gap-2 text-xs font-serif text-[#D4A574]/60">
                            <Shield className="w-3 h-3" />
                            <span>Est. 2018 • Trusted by 5000+</span>
                        </div>

                        <div className="flex space-x-2 pt-2">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ scale: 1.15, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 border border-white/5 bg-white/5 text-[#D4A574] hover:text-white flex items-center justify-center transition-all duration-300 ${social.color}`}
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Programs Column */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h4 className="text-lg font-serif font-normal text-[#FDFBF7]">
                            Our Programs
                        </h4>
                        <div className="w-12 h-px bg-[#C9A96E]" />
                        <ul className="space-y-2.5">
                            {programLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center text-sm font-serif font-light text-[#D4A574] hover:text-[#FDFBF7] transition-all duration-300"
                                    >
                                        <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-[#C9A96E]" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links Column */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h4 className="text-lg font-serif font-normal text-[#FDFBF7]">
                            Quick Links
                        </h4>
                        <div className="w-12 h-px bg-[#C9A96E]" />
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center text-sm font-serif font-light text-[#D4A574] hover:text-[#FDFBF7] transition-all duration-300"
                                    >
                                        <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-[#C9A96E]" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-3">
                                <Link
                                    to="/register"
                                    className="group inline-flex items-center gap-2 px-4 py-2 bg-[#C9A96E]/20 hover:bg-[#C9A96E]/30 text-[#D4A574] hover:text-[#FDFBF7] border border-[#C9A96E]/30 transition-all duration-300 text-sm font-serif font-light"
                                >
                                    Become a Member
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact Column */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h4 className="text-lg font-serif font-normal text-[#FDFBF7]">
                            Reach Us
                        </h4>
                        <div className="w-12 h-px bg-[#C9A96E]" />
                        <ul className="space-y-3.5">
                            <li className="group flex items-start gap-3 text-[#D4A574] hover:text-[#FDFBF7] transition-colors duration-300">
                                <div className="w-8 h-8 border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors duration-300 flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-[#C9A96E]" />
                                </div>
                                <span className="text-sm font-serif font-light">New Delhi, India</span>
                            </li>
                            <li className="group flex items-start gap-3 text-[#D4A574] hover:text-[#FDFBF7] transition-colors duration-300">
                                <div className="w-8 h-8 border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors duration-300 flex-shrink-0">
                                    <Phone className="w-4 h-4 text-[#C9A96E]" />
                                </div>
                                <span className="text-sm font-serif font-light">+91 XXX-XXX-XXXX</span>
                            </li>
                            <li className="group flex items-start gap-3 text-[#D4A574] hover:text-[#FDFBF7] transition-colors duration-300">
                                <div className="w-8 h-8 border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors duration-300 flex-shrink-0">
                                    <Mail className="w-4 h-4 text-[#C9A96E]" />
                                </div>
                                <span className="text-sm font-serif font-light">hello@adyomfoundation.org</span>
                            </li>
                            <li className="group flex items-start gap-3 text-[#D4A574] hover:text-[#FDFBF7] transition-colors duration-300">
                                <div className="w-8 h-8 border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors duration-300 flex-shrink-0">
                                    <Clock className="w-4 h-4 text-[#C9A96E]" />
                                </div>
                                <span className="text-sm font-serif font-light">Mon–Fri: 10am–6pm IST</span>
                            </li>
                        </ul>
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-2 w-full px-4 py-2.5 bg-[#C9A96E] text-[#3C2F2B] hover:bg-[#B87333] hover:text-white transition-all duration-300 text-sm font-serif flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Send a Message
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Newsletter Subscription Bar */}
            <div className="relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-[#C9A96E]" />
                            <span className="text-sm font-serif font-light text-[#D4A574]">
                                Join our newsletter for heritage updates
                            </span>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 bg-white/5 border border-white/10 text-[#FDFBF7] placeholder:text-[#D4A574]/50 text-sm font-serif font-light focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
                            />
                            <button className="px-4 py-2 bg-[#C9A96E] text-[#3C2F2B] hover:bg-[#B87333] hover:text-white transition-colors duration-300 text-sm font-serif whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs font-serif font-light text-[#D4A574]/60 text-center md:text-left">
                        © {new Date().getFullYear()} Adyom Foundation. All rights reserved.
                        Preserving heritage, nurturing creativity.
                    </p>
                    <p className="text-xs font-serif font-light text-[#D4A574]/60 flex items-center gap-1.5">
                        Made with
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Heart className="w-3 h-3 text-[#C9A96E] fill-[#C9A96E]" />
                        </motion.span>
                        in India
                    </p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
                
                * {
                    font-family: 'Playfair Display', 'Georgia', serif !important;
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-slower {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-slower {
                    animation: spin-slower 30s linear infinite;
                }
            `}</style>
        </footer>
    );
}