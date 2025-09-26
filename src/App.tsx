import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import AnimeDetailPage from "./components/AnimeDetail";
import MangaDetailPage from "./components/MangaDetail";
import Navbar from "./components/Navbar";
import AnimePage from "./components/AnimePage";
import MangaPage from "./components/MangaPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="pt-16 min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/manga" element={<MangaPage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
