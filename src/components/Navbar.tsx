import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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

  const activeClass = "text-blue-300 font-semibold";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-blue-800 text-white shadow-md transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          WibuKu
        </NavLink>

        <ul className="flex space-x-8">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors hover:text-blue-300 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/anime"
              className={({ isActive }) =>
                `transition-colors hover:text-blue-300 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Anime
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manga"
              className={({ isActive }) =>
                `transition-colors hover:text-blue-300 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              Manga
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
