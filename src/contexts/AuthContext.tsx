import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "@/lib/api";
import type { User, LoginResponse,RefreshTokenResponse } from "../lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook for accessing user information and authentication status
export const useUser = () => {
  const { user, isAuthenticated, token, refreshToken } = useAuth();

  return {
    user,
    isAuthenticated,
    token,
    refreshToken,
    isLoggedIn: isAuthenticated,
    userId: user?._id,
    userEmail: user?.email,
    userName: user ? `${user.firstName} ${user.lastName}` : '',
    userRole: user?.roleId?.name,
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedAuthStatus = localStorage.getItem("isAuthenticated");
      const storedToken = localStorage.getItem("userToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUserData = localStorage.getItem("userData");

      if (storedAuthStatus === "true" && storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setIsAuthenticated(true);
          setUser(userData);
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Clear corrupted data
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Clear all authentication data
  const clearAuthData = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  // Check if token is expired (simple check based on token structure)
  const isTokenExpired = (): boolean => {
    if (!token) return true;

    try {
      // Basic JWT expiration check (you might want to use a JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) {
      console.error("No refresh token available");
      return false;
    }

    try {
      console.log("Refreshing token using API...");

      const response: RefreshTokenResponse = await apiService.refreshToken({ refreshToken });

      if (response.success && response.data) {
        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        // Update state with new tokens
        setToken(newToken);
        setRefreshToken(newRefreshToken);

        // Update localStorage
        localStorage.setItem("userToken", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        console.log("Token refreshed successfully");
        return true;
      } else {
        console.error("Token refresh failed:", response.message);
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error("Token refresh API call failed:", error);
      clearAuthData();
      return false;
    }
  };

  // Login function using API
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const response: LoginResponse = await apiService.signin({ email, password });

      if (response.success && response.data) {
        const { user: userData, token: accessToken, refreshToken: refreshTokenValue } = response.data;

        // Update state
        setIsAuthenticated(true);
        setUser(userData);
        setToken(accessToken);
        setRefreshToken(refreshTokenValue);

        // Store in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userToken", accessToken);
        localStorage.setItem("refreshToken", refreshTokenValue);
        localStorage.setItem("userData", JSON.stringify(userData));

        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unable to connect to server";
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
  };

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        refreshAccessToken();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    refreshToken,
    isLoading,
    login,
    logout,
    refreshAccessToken,
    isTokenExpired,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};