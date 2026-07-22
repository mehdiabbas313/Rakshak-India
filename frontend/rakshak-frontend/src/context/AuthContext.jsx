import { createContext, useContext, useState } from "react";

import {
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("rakshakUser");

    if (
      !savedUser ||
      savedUser === "undefined" ||
      savedUser === "null"
    ) {
      localStorage.removeItem("rakshakUser");
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Saved user parse error:", error);

    localStorage.removeItem("rakshakUser");
    localStorage.removeItem("rakshakToken");

    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const saveUser = (userData) => {
    if (!userData) {
      return;
    }

    localStorage.setItem(
      "rakshakUser",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const saveAuthentication = (data) => {
    if (!data?.token || !data?.user) {
      throw new Error(
        "Authentication response me token ya user data missing hai."
      );
    }

    localStorage.setItem("rakshakToken", data.token);

    saveUser(data.user);
  };

  const register = async (formData) => {
    const data = await registerUser(formData);

    saveAuthentication(data);

    return data;
  };

  const login = async (formData) => {
    const data = await loginUser(formData);

    saveAuthentication(data);

    return data;
  };

  const updateUser = (userData) => {
    saveUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("rakshakToken");
    localStorage.removeItem("rakshakUser");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}