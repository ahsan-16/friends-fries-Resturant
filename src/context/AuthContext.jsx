// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const saved = localStorage.getItem("ff_user");
//     if (saved) setUser(JSON.parse(saved));
//     setLoading(false);
//   }, []);

//   const signup = (name, email, password) => {
//     const users = JSON.parse(localStorage.getItem("ff_users") || "[]");
//     if (users.find((u) => u.email === email)) {
//       throw new Error("Email already registered");
//     }
//     const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
//     users.push(newUser);
//     localStorage.setItem("ff_users", JSON.stringify(users));
//     const { password: _, ...safeUser } = newUser;
//     setUser(safeUser);
//     localStorage.setItem("ff_user", JSON.stringify(safeUser));
//     return safeUser;
//   };

//   const signin = (email, password) => {
//     const users = JSON.parse(localStorage.getItem("ff_users") || "[]");
//     const found = users.find((u) => u.email === email && u.password === password);
//     if (!found) throw new Error("Invalid email or password");
//     const { password: _, ...safeUser } = found;
//     setUser(safeUser);
//     localStorage.setItem("ff_user", JSON.stringify(safeUser));
//     return safeUser;
//   };

//   const signout = () => {
//     setUser(null);
//     localStorage.removeItem("ff_user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api("/auth/me").then((data) => {
        if (data.success) setUser(data.data.user);
        else localStorage.removeItem("accessToken");
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (name, email, password) => {
    const data = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("accessToken", data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const signin = async (email, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("accessToken", data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const signout = async () => {
    await api("/auth/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);