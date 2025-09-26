import React from 'react';
import './App.css';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <Homepage />
    </div>
  );
}

export default App;
