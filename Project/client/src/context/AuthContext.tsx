import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, SupportedLanguage } from '../../../shared/types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  preferredLanguage: SupportedLanguage;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  FARMER: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'farmer@agrivision.ai',
    fullName: 'Ramesh Patel (Progressive Farmer)',
    role: 'FARMER',
    preferredLanguage: 'hi',
    token: 'demo-farmer-token'
  },
  AGRONOMIST: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'agronomist@agrivision.ai',
    fullName: 'Dr. Ananya Sharma (Chief Plant Pathologist)',
    role: 'AGRONOMIST',
    preferredLanguage: 'en',
    token: 'demo-agronomist-token'
  },
  ADMIN: {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'admin@agrivision.ai',
    fullName: 'AgriVision Operations Administrator',
    role: 'ADMIN',
    preferredLanguage: 'en',
    token: 'demo-admin-token'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agrivision_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default to Farmer demo user
    return DEMO_USERS.FARMER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agrivision_token') || 'demo-farmer-token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrivision_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrivision_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('agrivision_token', token);
    } else {
      localStorage.removeItem('agrivision_token');
    }
  }, [token]);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrivision_user');
    localStorage.removeItem('agrivision_token');
  };

  const switchRole = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    setToken(demo.token || `demo-${role.toLowerCase()}-token`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchRole,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
