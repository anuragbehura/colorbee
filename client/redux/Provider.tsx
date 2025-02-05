"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { useUser } from "@/hooks/useUser";

// Define Auth Context Types
interface AuthContextType {
    user: any | null;
    userToken: string | null;
}

// Create Context with Default Values
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const user = useUser(); // Get unique user token

    return (
        <AuthContext.Provider value={{ user, userToken: user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Redux Provider Component
const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>{children}</AuthProvider>
        </PersistGate>
    </Provider>
);

export default AppProvider;
