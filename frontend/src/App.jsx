import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Programs from '@/pages/Programs';
import ProgramDetail from '@/pages/ProgramDetail';
import Corporate from '@/pages/Corporate';
import ArtisanConnect from '@/pages/ArtisanConnect';
import Gallery from '@/pages/Gallery';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import LearningPlayer from '@/pages/LearningPlayer';
import VideoPage from '@/pages/VideoPage';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Products from '@/pages/Products';
import MeetJoin from '@/pages/MeetJoin';
import PaymentTest from '@/pages/PaymentTest';

// Member Dashboard Pages
import DashboardHome from '@/pages/dashboard/DashboardHome';
import DashboardProfile from '@/pages/dashboard/DashboardProfile';
import DashboardPrograms from '@/pages/dashboard/DashboardPrograms';
import DashboardArtwork from '@/pages/dashboard/DashboardArtwork';
import DashboardVideos from '@/pages/dashboard/DashboardVideos';
import DashboardLearning from '@/pages/dashboard/DashboardLearning';
import DashboardCommunity from '@/pages/dashboard/DashboardCommunity';
import DashboardCertificates from '@/pages/dashboard/DashboardCertificates';
import DashboardPratibimb from '@/pages/dashboard/DashboardPratibimb';

// Admin Dashboard Pages
import AdminHome from '@/pages/admin/AdminHome';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminPrograms from '@/pages/admin/AdminPrograms';
import AdminWorkshops from '@/pages/admin/AdminWorkshops';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminArtworks from '@/pages/admin/AdminArtworks';
import AdminVideos from '@/pages/admin/AdminVideos';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminCorporate from '@/pages/admin/AdminCorporate';
import AdminContact from '@/pages/admin/AdminContact';
import AdminCommunity from '@/pages/admin/AdminCommunity';
import AdminLearning from '@/pages/admin/AdminLearning';
import AdminCertificates from '@/pages/admin/AdminCertificates';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminSponsors from '@/pages/admin/AdminSponsors';
import AdminProducts from '@/pages/admin/AdminProducts';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/programs/:slug/learn" element={
              <ProtectedRoute roles={['member', 'admin']}>
                <LearningPlayer />
              </ProtectedRoute>
            } />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/artisan-connect" element={<ArtisanConnect />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/videos/:id" element={<VideoPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
          </Route>

          {/* Standalone Public Routes */}
          <Route path="/meet/:meetId" element={<MeetJoin />} />
          <Route path="/payment-test" element={<ProtectedRoute roles={['member', 'admin']}><PaymentTest /></ProtectedRoute>} />

          {/* Member Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute roles={['member', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="/dashboard/profile" element={<DashboardProfile />} />
            <Route path="/dashboard/programs" element={<DashboardPrograms />} />
            <Route path="/dashboard/pratibimb" element={<DashboardPratibimb />} />
            <Route path="/dashboard/artwork" element={<DashboardArtwork />} />
            <Route path="/dashboard/videos" element={<DashboardVideos />} />
            <Route path="/dashboard/learning" element={<DashboardLearning />} />
            <Route path="/dashboard/community" element={<DashboardCommunity />} />
            <Route path="/dashboard/certificates" element={<DashboardCertificates />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/programs" element={<AdminPrograms />} />
            <Route path="/admin/workshops" element={<AdminWorkshops />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/artworks" element={<AdminArtworks />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/corporate" element={<AdminCorporate />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="/admin/community" element={<AdminCommunity />} />
            <Route path="/admin/learning" element={<AdminLearning />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/sponsors" element={<AdminSponsors />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
