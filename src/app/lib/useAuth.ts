import { useState, useEffect, useCallback } from 'react';
import { AuthUser } from './types';
import { db } from './db';

interface UseAuthReturn {
    user: AuthUser | null;
    isLoading: boolean;
    login: (code: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const session = db.getSession();
        setUser(session);
        setIsLoading(false);
    }, []);

    const login = useCallback(async (code: string, password: string): Promise<boolean> => {
        const authUser = await db.login(code, password);
        if (authUser) {
            db.saveSession(authUser);
            setUser(authUser);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        db.clearSession();
        setUser(null);
    }, []);

    return { user, isLoading, login, logout };
}
