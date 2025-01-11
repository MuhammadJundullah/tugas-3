import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("system"); // Default ke "system" (mengikuti pengaturan OS)

  useEffect(() => {
    // Cek preferensi dari OS atau localStorage jika ada
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Cek preferensi sistem
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDarkScheme) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  }, []);

  useEffect(() => {
    // Set class sesuai pilihan
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Tidak mengubah jika pilihan "system"
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDarkScheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Simpan pengaturan tema ke localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleThemeChange("light")}
        className={`px-4 py-2 ${
          theme === "light" ? "bg-gray-300" : "bg-transparent"
        } rounded`}>
        Light
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`px-4 py-2 ${
          theme === "dark" ? "bg-gray-300" : "bg-transparent"
        } rounded`}>
        Dark
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={`px-4 py-2 ${
          theme === "system" ? "bg-gray-300" : "bg-transparent"
        } rounded`}>
        System
      </button>
    </div>
  );
};

export default ThemeToggle;
