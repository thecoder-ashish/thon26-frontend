import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';

// Define the type for the user
export type UserType = {
  token: string;
  role: 'admin' | 'poc' | string;
  username?: string;
} | null;

interface AuthContextType {
  user: UserType;
  login: (token: string, role?: string, username?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  // When initializing, check if a JWT exists in local storage.
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role') || 'admin';
    const username = localStorage.getItem('username') || '';

    if (token) {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  const login = (token: string, role: string = 'admin', username: string = '') => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    setUser({ token, role, username });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
