import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInitialSession();

    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getInitialSession() {
    const {
      data: { session },
    } = await authService.getSession();

    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;