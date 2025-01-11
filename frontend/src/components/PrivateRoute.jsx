import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    // Tampilkan loader saat sedang memeriksa autentikasi
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect ke halaman login jika tidak terautentikasi
    return <Navigate to="/login" />;
  }

  // Tampilkan konten jika pengguna terautentikasi
  return children;
};

export default PrivateRoute;
