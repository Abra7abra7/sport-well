export type AuthProviderUser = {
    id: string; // The external provider's ID (e.g. Clerk ID)
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
};

export interface AuthService {
    /**
     * Retrieves the current authenticated user's external profile.
     * Returns null if not authenticated.
     */
    getCurrentUser(): Promise<AuthProviderUser | null>;

    /**
     * Generates the URL for login/signup redirection.
     */
    getLoginUrl(redirectUrl?: string): string;

    /**
     * Generates the URL for logging out.
     */
    getLogoutUrl(redirectUrl?: string): string;

    /**
     * Enforces role requirements (used in Middleware or Server Actions).
     */
    requireRole(role: 'CLIENT' | 'TRAINER' | 'ADMIN'): Promise<boolean>;
}
