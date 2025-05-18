import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { IUser } from '@/types/IUser';
import { useUser as useClerkUser, useAuth } from '@clerk/clerk-react';
import { getUser, register } from '@/api/user';
import { ErrorResponse } from '@/api/config';
import { setTokenProvider } from '@/api/tokenProvider';

interface UserContextType {
    user: IUser | null; // Backend user
    setUser: (user: IUser) => void;
    isAuthenticated: boolean; // Clerk session
    token: string | null; // Clerk JWT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clerkUser: any; // Clerk user object
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const { user: clerkUser, isSignedIn } = useClerkUser();
    const { getToken, signOut } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (isSignedIn && getToken) {
                const jwt = await getToken();
                if (!jwt) {
                    setUser(null);
                    setToken(null);
                    return;
                }
                localStorage.setItem('token', jwt);
                setToken(jwt);
                try {
                    const res = await getUser();
                    setUser(res);
                } catch (err: unknown) {
                    if (err instanceof ErrorResponse && err.status === 404 && clerkUser) {
                      await register({
                        clerkId: clerkUser.id,
                        email: clerkUser.emailAddresses[0].emailAddress,
                        name: clerkUser.firstName || '',
                      });
                      const res = await getUser();
                      setUser(res);
                    } else {
                      setUser(null);
                    }
                  }
            } else {
                setUser(null);
                setToken(null);
            }
        };
        fetchUser();
    }, [isSignedIn, getToken, clerkUser]);

    useEffect(() => {
        setTokenProvider(getToken);
    }, [getToken]);

    const logout = () => {
        signOut();
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        setUser,
        isAuthenticated: !!isSignedIn,
        token,
        clerkUser,
        logout,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used inside a UserProvider');
    }
    return context;
};
