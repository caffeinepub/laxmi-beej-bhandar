import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { SecurityAnswer, UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  signup: (profile: UserProfile) => boolean;
  login: (phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  getSecurityQuestions: (phone: string) => string[] | null;
  verifySecurityAnswers: (phone: string, answers: SecurityAnswer[]) => boolean;
  resetPasswordWithAnswers: (
    phone: string,
    answers: SecurityAnswer[],
    newPassword: string,
  ) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "lbb_users";
const CURRENT_KEY = "lbb_current_user";

function getUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
  }, [user]);

  const signup = (profile: UserProfile): boolean => {
    const users = getUsers();
    if (users.find((u) => u.phone === profile.phone)) return false;
    users.push(profile);
    saveUsers(users);
    return true;
  };

  const login = (phone: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(
      (u) => u.phone === phone && u.password === password,
    );
    if (!found) return false;
    setUser(found);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.phone === user.phone);
    const updated = { ...user, ...updates };
    if (idx !== -1) {
      users[idx] = updated;
      saveUsers(users);
    }
    setUser(updated);
  };

  const changePassword = (oldPass: string, newPass: string): boolean => {
    if (!user) return false;
    if (user.password !== oldPass) return false;
    updateProfile({ password: newPass });
    return true;
  };

  const getSecurityQuestions = (phone: string): string[] | null => {
    const users = getUsers();
    const found = users.find((u) => u.phone === phone);
    if (!found || !found.securityAnswers || found.securityAnswers.length === 0)
      return null;
    return found.securityAnswers.map((sa) => sa.question);
  };

  const verifySecurityAnswers = (
    phone: string,
    answers: SecurityAnswer[],
  ): boolean => {
    const users = getUsers();
    const found = users.find((u) => u.phone === phone);
    if (!found || !found.securityAnswers) return false;
    return answers.every((ans) => {
      const stored = found.securityAnswers!.find(
        (sa) => sa.question === ans.question,
      );
      return stored && stored.answer === ans.answer.trim().toLowerCase();
    });
  };

  const resetPasswordWithAnswers = (
    phone: string,
    answers: SecurityAnswer[],
    newPassword: string,
  ): boolean => {
    if (!verifySecurityAnswers(phone, answers)) return false;
    const users = getUsers();
    const idx = users.findIndex((u) => u.phone === phone);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], password: newPassword };
    saveUsers(users);
    // If this is the currently logged-in user, update state too
    if (user && user.phone === phone) {
      setUser({ ...user, password: newPassword });
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        updateProfile,
        changePassword,
        getSecurityQuestions,
        verifySecurityAnswers,
        resetPasswordWithAnswers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
