import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./modules/marketing/presentation/components/Header/Header";
import Footer from "./modules/marketing/presentation/components/Footer/Footer";
import Blog from "./modules/marketing/presentation/pages/Blog/Blog/Blog";
import Home from "./modules/marketing/presentation/pages/Home/Home";
import LearnerJourney from "./modules/marketing/presentation/pages/Learner_journey/Learner_journey";
import About from "./modules/marketing/presentation/pages/About/About";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learner-journey" element={<LearnerJourney />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;