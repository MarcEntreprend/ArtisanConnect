import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ArtisanDetail from "./pages/ArtisanDetail";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Onboarding from "./pages/Onboarding";
import Appointments from "./pages/Appointments";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BookingModal from "./components/features/BookingModal";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/artisan/:id" element={<ArtisanDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <BottomNav />
        <BookingModal />
      </BrowserRouter>
    </AuthProvider>
  );
}
