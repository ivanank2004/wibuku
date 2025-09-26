import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo / Judul */}
        <div className="text-2xl font-bold tracking-wide cursor-pointer">
          WibuKu
        </div>

        {/* Menu Navigasi */}
        <ul className="flex space-x-8">
          <li className="hover:text-blue-300 cursor-pointer transition-colors">Home</li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">Anime</li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">Manga</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
