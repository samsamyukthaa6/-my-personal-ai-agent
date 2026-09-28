import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  getActiveUserId,
  setActiveUserId,
  DEMO_USER,
  loadUserData
} from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<User>;
  loginDemo: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding: (prefs: Partial<UserPreferences>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const users = getRegisteredUsers();
    // Ensure demo user is registered if not present
    if (!users.some(u => u.id === DEMO_USER.id)) {
      users.push(DEMO_USER);
      saveRegisteredUsers(users);
      // Pre-seed demo data
      loadUserData(DEMO_USER.id);
    }

    const activeId = getActiveUserId();
    if (activeId) {
      const found = users.find(u => u.id === activeId);
      if (found) {
        setCurrentUser(found);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      setCurrentUser(found);
      setActiveUserId(found.id);
      loadUserData(found.id);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string): Promise<User> => {
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      setCurrentUser(existing);
      setActiveUserId(existing.id);
      return existing;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      preferences: {
        theme: 'dark',
        workingHoursStart: '09:00',
        workingHoursEnd: '17:00',
        dailyAvailableHours: 6,
        mainGoal: 'Organize priorities and reach key goals',
        planningStyle: 'balanced',
        focusAreas: ['Work', 'Study', 'Personal Growth'],
        enableAiMemory: true
      }
    };

    users.push(newUser);
    saveRegisteredUsers(users);
    setCurrentUser(newUser);
    setActiveUserId(newUser.id);
    loadUserData(newUser.id);
    return newUser;
  };

  const loginDemo = () => {
    const users = getRegisteredUsers();
    let demo = users.find(u => u.id === DEMO_USER.id);
    if (!demo) {
      users.push(DEMO_USER);
      saveRegisteredUsers(users);
      demo = DEMO_USER;
    }
    setCurrentUser(demo);
    setActiveUserId(demo.id);
    loadUserData(demo.id);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveUserId(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    const users = getRegisteredUsers().map(u => (u.id === updated.id ? updated : u));
    saveRegisteredUsers(users);
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...prefs
      }
    };
    updateUser(updated);
  };

  const completeOnboarding = (prefs: Partial<UserPreferences>) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      onboardingCompleted: true,
      preferences: {
        ...currentUser.preferences,
        ...prefs
      }
    };
    updateUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        signup,
        loginDemo,
        logout,
        updateUser,
        updatePreferences,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
