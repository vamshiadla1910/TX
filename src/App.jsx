import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./modules/marketing/presentation/components/Header/Header";
import Footer from "./modules/marketing/presentation/components/Footer/Footer";

import Home from "./modules/marketing/presentation/pages/Home/Home";
import LearnerJourney from "./modules/marketing/presentation/pages/Learner_journey/Learner_journey";
import About from "./modules/marketing/presentation/pages/About/About";

import Marketplace from "./modules/marketing/presentation/pages/MarketPlace/MarketPlace";
import Blog from "./modules/marketing/presentation/pages/Blog/Blog";
import CareersHero from "./modules/marketing/presentation/pages/Careers/Careers";
import Organization from "./modules/marketing/presentation/pages/Contact/Contact";
import Cart from "./modules/marketing/presentation/pages/Cart/Cart";
import CourseDetail from "./modules/marketing/presentation/pages/CourseDetails/CourseDetails";

import Login from "./modules/marketing/presentation/components/Login/Login";
import Signin from "./modules/marketing/presentation/components/Login/signin";

import RegistrationForm from "./modules/marketing/presentation/components/HackathonRegistration/RegistrationForm";
import Events from "./modules/marketing/presentation/pages/Events/Events.jsx";

// Hackathon Dashboard (Preserved 100%)
import HackathonDashboard from "./modules/marketing/presentation/pages/HackathonDashboard/HackathonDashboard.jsx";
// Student Dashboard (with Sidebar + Assessments + Certificates)
import Dashboard from "./modules/marketing/presentation/pages/StudentDashboard/Dashboard/Dashboard.jsx";
import Assessments from "./modules/marketing/presentation/pages/StudentDashboard/Assessments/Assessments.jsx";
import Certificates from "./modules/marketing/presentation/pages/StudentDashboard/Certificates/Certificates.jsx";

// Platform Admin Dashboard
import AdminDashboard from "./modules/marketing/presentation/pages/AdminDashboard/AdminDashboard.jsx";

// Instructor Dashboard (Advanced Monolithic Model)
import InstructorDashboard from "./modules/marketing/presentation/pages/instructor";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();

  // Don't show normal website Header/Footer on dashboards (Hackathon, Student, Assessments, Certificates, Admin, or Instructor)
  const hideHeaderFooter =
    location.pathname.startsWith("/hackathon-dashboard") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/student") ||
    location.pathname.toLowerCase().startsWith("/assessments") ||
    location.pathname.toLowerCase().startsWith("/certificates") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/instructor") ||
    location.pathname.startsWith("/instructor-dashboard");

  return (
    <>
      <ScrollToTop />

      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Explore / Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Course Details */}
        <Route path="/course/:id" element={<CourseDetail />} />

        {/* Other pages */}
        <Route path="/events" element={<Events />} />

        <Route path="/careers" element={<CareersHero />} />

        <Route path="/blog" element={<Blog />} />

        <Route
          path="/learner-journey"
          element={<LearnerJourney />}
        />

        <Route path="/about" element={<About />} />

        <Route
          path="/contact"
          element={<Organization />}
        />

        {/* Existing Login / Signin */}
        <Route path="/login" element={<Login />} />
        <Route path="/Signin" element={<Signin />} />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/registration"
          element={<RegistrationForm />}
        />

        {/* =====================================
            HACKATHON ADMIN DASHBOARD (PRESERVED)
            ===================================== */}
        <Route
          path="/hackathon-dashboard"
          element={<HackathonDashboard />}
        />
        {/* Student Dashboard routes (Sidebar with all topics; opens tabs or deep links) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/student" element={<Dashboard />} />
        <Route path="/student/*" element={<Dashboard />} />
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route path="/student-dashboard/*" element={<Dashboard />} />

        <Route path="/assessments" element={<Dashboard />} />
        <Route path="/assessments/*" element={<Dashboard />} />
        <Route path="/Assessments" element={<Dashboard />} />
        <Route path="/Assessments/*" element={<Dashboard />} />

        <Route path="/certificates" element={<Dashboard />} />
        <Route path="/certificates/*" element={<Dashboard />} />
        <Route path="/Certificates" element={<Dashboard />} />
        <Route path="/Certificates/*" element={<Dashboard />} />

        {/* =====================================
            PLATFORM ADMIN DASHBOARD
            ===================================== */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />

        {/* =====================================
            INSTRUCTOR DASHBOARD
            ===================================== */}
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/*" element={<InstructorDashboard />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor-dashboard/*" element={<InstructorDashboard />} />

      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;