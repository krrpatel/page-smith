import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await fetch('http://18.140.66.9:1435/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  } finally {
    setIsLoading(false);
  }
};


const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await fetch('http://18.140.66.9:1435/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Signup error:', error);
    return false;
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
