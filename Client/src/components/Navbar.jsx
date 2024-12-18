/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaSignInAlt, FaUser, FaCog, FaPowerOff } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ThemeSwitch from "./ThemeSwitch";


const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navItems = user
    ? [
        { name: "Dashboard", to: "/dashboard", icon: <FaUser /> },
        { name: "Profile", to: "/profile", icon: <FaCog /> },
        { name: "About", to: "/about", icon: <FaInfoCircle /> },
      ]
    : [
        { name: "Home", to: "/", icon: <FaHome /> },
        { name: "About", to: "/about", icon: <FaInfoCircle /> },
        { name: "Login", to: "/login", icon: <FaSignInAlt /> },
      ];

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <nav className="w-full dark:bg-black dark:text-white text-black bg-white">
      <div className="max-w-7xl bg-transparent mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Brand
        </Link>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className="flex items-center space-x-2 hover:text-yellow-600"
              >
                {item.icon} <span>{item.name}</span>
              </Link>
            </li>
          ))}

          {user ? (
            <li>
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none hover:text-gray-300"
                >
                  <img
                    src={user.profileImage || "/placeholder.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </button>
                {isProfileMenuOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-md text-sm">
                    <li>
                      <ThemeSwitch/>
                    </li>
                    <li>
                      <button
                        onClick={() => console.log("Logout")}
                        className="block w-full px-4 py-2 hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          ) : <ThemeSwitch/>}
        </ul>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <ul className="md:hidden bg-gray-800 py-4 space-y-4 text-center">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className="flex items-center justify-center space-x-2 hover:text-gray-300"
                onClick={closeMobileMenu}
              >
                {item.icon} <span>{item.name}</span>
              </Link>
            </li>
          ))}
          {!user && (
            <li>
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none hover:text-gray-300"
                >
                  <img
                    src={user.profileImage || "/placeholder.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </button>
                {isProfileMenuOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-md text-sm">
                    <li>
                    <ThemeSwitch/>
                    </li>
                    <li>
                      <button
                        onClick={() => console.log("Logout")}
                        className="block w-full px-4 py-2 hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
