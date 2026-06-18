import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adyom_token');
        if (token) {
            authAPI
                .getMe()
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('adyom_token');
                    localStorage.removeItem('adyom_user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token, user } = res.data;
        localStorage.setItem('adyom_token', token);
        localStorage.setItem('adyom_user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const register = async (data) => {
        const res = await authAPI.register(data);
        const { token, user } = res.data;
        localStorage.setItem('adyom_token', token);
        localStorage.setItem('adyom_user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('adyom_token');
        localStorage.removeItem('adyom_user');
        setUser(null);
    };

    const updateProfile = async (data) => {
        const res = await authAPI.updateProfile(data);
        setUser(res.data.user);
        localStorage.setItem('adyom_user', JSON.stringify(res.data.user));
        return res.data.user;
    };

    const isAuthenticated = !!user;
    const isMember = user?.role === 'member' || user?.role === 'admin';
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateProfile,
                isAuthenticated,
                isMember,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;