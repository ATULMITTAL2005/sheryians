import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

const demoUser = { name: 'Enqueue Demo', email: 'demo@verve.dev', password: 'Verve@1234' };

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage('verve-current-user', null);
  const [users, setUsers] = useLocalStorage('verve-users', [demoUser]);

  const login = (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const user = users.find(
      (entry) => normalizeEmail(entry.email) === normalizedEmail && entry.password === password,
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    setCurrentUser({ name: user.name, email: user.email });
    return { success: true, message: 'Welcome back.' };
  };

  const signup = ({ name, email, password }) => {
    const normalizedEmail = normalizeEmail(email);

    if (users.some((entry) => normalizeEmail(entry.email) === normalizedEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const nextUser = { name: name.trim(), email: normalizedEmail, password };
    setUsers((currentUsers) => [...currentUsers, nextUser]);
    setCurrentUser({ name: nextUser.name, email: nextUser.email });

    return { success: true, message: 'Account created successfully.' };
  };

  const logout = () => setCurrentUser(null);
  const updateProfile = (updates) => setCurrentUser((current) => ({ ...current, ...updates }));

  const value = useMemo(
    () => ({ currentUser, isAuthenticated: Boolean(currentUser), login, signup, logout, updateProfile }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}