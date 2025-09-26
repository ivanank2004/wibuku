import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // scroll ke bawah => sembunyikan, scroll ke atas => tampilkan
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-blue-800 text-white shadow-md transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          WibuKu
        </Link>

        <ul className="flex space-x-8">
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            Home
          </li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            Anime
          </li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            Manga
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
