import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-heritage-creamLight">
            <Navbar />
            <main className="flex-1 pt-[calc(4rem+1px)] md:pt-[calc(5rem+1px)]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}