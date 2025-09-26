import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import AnimeDetailPage from "./components/AnimeDetail";
import MangaDetailPage from "./components/MangaDetail";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
