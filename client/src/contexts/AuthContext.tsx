import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProfile, login as apiLogin } from "../api/client";

interface User {
  id: string;
  employeeId: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getProfile()
      .then((r) => {
        if (r.data) setUser(r.data as User);
      })
      .catch(() => localStorage.removeItem("crm_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await apiLogin(email, password);
    if (!r.data?.user) throw new Error(r.message || "Login failed");
    setUser(r.data.user as User);
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
