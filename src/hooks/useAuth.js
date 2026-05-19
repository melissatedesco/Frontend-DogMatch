import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.clear();
      }
    }
    return null;
  });

  const authChecked = true;

  const handleLoginSuccess = (userData) => {
    localStorage.removeItem("dogMatches");
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/home");
  };

  const handleRegisterSuccess = (userData) => {
    localStorage.removeItem("dogMatches");
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dogMatches");
    setUser(null);
    navigate("/");
  };

  return {
    user,
    setUser,
    authChecked,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleLogout,
  };
};
