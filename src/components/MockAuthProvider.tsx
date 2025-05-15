import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  email: string;
};

type DbUser = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

type Session = {
  user: User;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: DbUser | null;
  isLoading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock user data
  const mockUser = {
    id: "mock-user-id",
    email: "user@example.com",
  };

  const mockProfile = {
    id: "mock-user-id",
    email: "user@example.com",
    display_name: "Mock User",
    avatar_url: null,
    created_at: new Date().toISOString(),
  };

  const mockSession = {
    user: mockUser,
  };

  return (
    <AuthContext.Provider
      value={{
        session: mockSession,
        user: mockUser,
        profile: mockProfile,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
