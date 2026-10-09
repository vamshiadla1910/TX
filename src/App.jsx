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

// Hackathon Dashboard
import HackathonDashboard from "./modules/marketing/presentation/pages/HackathonDashboard/HackathonDashboard.jsx";
// Student Dashboard
import Dashboard from "./modules/marketing/presentation/pages/StudentDashboard/Dashboard/Dashboard.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();

  // Don't show normal website Header/Footer on admin dashboard
  const isHackathonDashboard =
    location.pathname === "/hackathon-dashboard";

  return (
    <>
      <ScrollToTop />

      {!isHackathonDashboard && <Header />}

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
            HACKATHON ADMIN DASHBOARD
            ===================================== */}
        <Route
          path="/hackathon-dashboard"
          element={<HackathonDashboard />}
        />
        {/* Student Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />}/>
        {/* Checkout - enable when Checkout.jsx exists */}
        {/*
        <Route
          path="/checkout/:id"
          element={<Checkout />}
        />
        */}
      </Routes>

      {!isHackathonDashboard && <Footer />}
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