import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setTheme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(false);
  const navigate = useNavigate();

  // Ambil token dan user info dari localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Cek apakah user sudah login
  const isAuthenticated = token && user;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // Detect system theme preference (dark or light)
  useEffect(() => {
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsSystemTheme(systemTheme);
  }, []);

  // Function to handle theme change
  const handleThemeChange = (theme) => {
    setTheme(theme);
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="text-black dark:text-white font-bold text-lg">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">
          Employee Management
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Link Add Employee hanya tampil jika sudah login */}
        {isAuthenticated && (
          <Link
            to="/add-item"
            className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-md">
            Add Employee
          </Link>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center space-x-2">
          {/* Light Theme */}
          <button
            onClick={() => handleThemeChange("light")}
            className="text-black dark:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            🌞
          </button>

          {/* Dark Theme */}
          <button
            onClick={() => handleThemeChange("dark")}
            className="text-black dark:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            🌙
          </button>

          {/* System Theme (follow system setting) */}
          <button
            onClick={() => handleThemeChange("system")}
            className={`text-black dark:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 ${
              isSystemTheme ? "text-green-500" : ""
            }`}>
            🖥️
          </button>
        </div>

        {/* Dropdown untuk Logout hanya tampil jika sudah login */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-black dark:text-white flex items-center space-x-2">
              <span>{user.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-40">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
