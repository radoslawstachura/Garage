"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '@/lib/auth';

type JwtContextType = {
    username: string | null;
    setUsername: (u: string | null) => void;
    role: string | null;
    setRole: (u: string | null) => void;
    loading: boolean;
};

const JwtContext = createContext<JwtContextType | undefined>(undefined);

export const JwtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const refreshAccessToken = async () => {
        const userObject = await auth.refreshAccessToken();

        if (userObject) {
            setUsername(userObject.login);
            setRole(userObject.role);
        } else {
            setUsername(null);
            setRole(null);
        }
    };

    useEffect(() => {
        (async () => {
            await refreshAccessToken();
            setLoading(false);
        })();
    }, [])

    return (
        <JwtContext.Provider value={{ username, setUsername, role, setRole, loading }}>
            {children}
        </JwtContext.Provider>
    );
};


export function useJwt() {
    const ctx = useContext(JwtContext);
    if (!ctx) {
        throw new Error("useJwt must be used inside <JwtProvider>");
    }
    return ctx;
}