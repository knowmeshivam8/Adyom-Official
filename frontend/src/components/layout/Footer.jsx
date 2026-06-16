import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import {
    MapPin,
    Phone,
    Mail,
    Heart,
} from 'lucide-react';

// Custom SVG social icons (brand icons removed from lucide-react v1.17+)
const Facebook = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.582-5.978.826 0 2.264.164 2.264.164v2.745h-1.264c-1.264 0-1.776.517-1.776 1.575v1.574h3.014l-.404 3.667h-2.61v7.98C18.487 23.143 24 18.324 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.628 3.874 10.35 9.101 11.691Z" /></svg>
);
const Instagram = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881Z" /></svg>
);
const Youtube = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" /></svg>
);
const Twitter = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const Linkedin = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
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

export default function Footer() {
    return (
        <footer className="bg-heritage-terracotta text-text-main">
            {/* Heritage decorative top border */}
            <div className="h-2 bg-gradient-to-r from-heritage-gold via-heritage-terracottaLight to-heritage-gold" />

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-heritage-terracottaDark font-heading text-xl font-bold">
                                A
                            </div>
                            <div>
                                <h3 className="text-2xl font-heading font-bold text-text-main tracking-wide">
                                    Adyom
                                </h3>
                                <p className="text-xs text-text-main font-accent tracking-widest">
                                    Foundation
                                </p>
                            </div>
                        </div>
                        <p className="text-sm font-body text-text-main leading-relaxed">
                            Preserving India's timeless heritage through art, mindfulness, and community.
                            Where tradition meets transformation — a canvas of heritage for the modern soul.
                        </p>
                        <div className="flex space-x-3">
                            {[Facebook, Instagram, Youtube, Twitter, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-text-main hover:text-heritage-terracottaDark flex items-center justify-center transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Programs Column */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-heading font-semibold text-text-main">
                            Our Programs
                        </h4>
                        <Separator className="w-12 bg-white" />
                        <ul className="space-y-2">
                            {programLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm font-body text-text-main hover:text-text-main transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-heading font-semibold text-text-main">
                            Quick Links
                        </h4>
                        <Separator className="w-12 bg-white" />
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm font-body text-text-main hover:text-text-main transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/register"
                                    className="text-sm font-body text-text-main hover:text-text-mainLight transition-colors font-semibold"
                                >
                                    Become a Member →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-heading font-semibold text-text-main">
                            Reach Us
                        </h4>
                        <Separator className="w-12 bg-white" />
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-text-main mt-1" />
                                <span className="text-sm font-body text-text-main">
                                    New Delhi, India
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-text-main mt-1" />
                                <span className="text-sm font-body text-text-main">
                                    +91 XXX-XXX-XXXX
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-text-main mt-1" />
                                <span className="text-sm font-body text-text-main">
                                    hello@adyomfoundation.org
                                </span>
                            </li>
                        </ul>
                        <Link to="/contact">
                            <button className="mt-2 px-4 py-2 bg-white text-heritage-terracottaDark text-sm font-body font-medium rounded-md hover:bg-whiteLight transition-colors">
                                Send a Message
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-heritage-terracottaLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-xs font-body text-text-main">
                        © {new Date().getFullYear()} Adyom Foundation. All rights reserved.
                        Preserving heritage, nurturing creativity.
                    </p>
                    <p className="text-xs font-body text-text-main flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-text-main" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}