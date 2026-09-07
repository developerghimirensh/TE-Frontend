"use client";

import {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";

import {
getAccessToken,
clearAuth,
AuthResponse,
} from "@/lib/api";

// ============================================================
// TYPES
// ============================================================

interface AuthContextType {
isAuthenticated: boolean;
loading: boolean;
login: (data: AuthResponse) => void;
logout: () => void;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(
undefined
);

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({
children,
}: {
children: ReactNode;
}) {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loading, setLoading] = useState(true);

// ==========================================================
// CHECK AUTHENTICATION ON INITIAL LOAD
// ==========================================================

useEffect(() => {
const token = getAccessToken();

setIsAuthenticated(Boolean(token));
setLoading(false);

}, []);

// ==========================================================
// LOGIN
// ==========================================================

const login = (_data: AuthResponse) => {
  setIsAuthenticated(true);
};

// ==========================================================
// LOGOUT
// ==========================================================

const logout = () => {
// Clear all authentication data
clearAuth();

// Immediately update React state
setIsAuthenticated(false);

};

// ==========================================================
// PROVIDER
// ==========================================================

return (
<AuthContext.Provider
value={{
isAuthenticated,
loading,
login,
logout,
}}
>
{children}
</AuthContext.Provider>
);
}

// ============================================================
// HOOK
// ============================================================

export function useAuth() {
const context = useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used inside AuthProvider"
);
}

return context;
}
