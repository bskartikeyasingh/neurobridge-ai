import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

 useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser || savedUser === "undefined" || savedUser === "null") {
    localStorage.removeItem("user");
    return;
  }

  try {
    const parsedUser = JSON.parse(savedUser);

    if (parsedUser && typeof parsedUser === "object") {
      setUser(parsedUser);
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Invalid saved user data:", error);
    localStorage.removeItem("user");
  }
}, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}