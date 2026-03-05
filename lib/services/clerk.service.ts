import { auth, currentUser } from '@clerk/nextjs/server';
import { AuthService, AuthProviderUser } from './auth.interface';

export class ClerkAuthAdapter implements AuthService {
    async getCurrentUser(): Promise<AuthProviderUser | null> {
        const user = await currentUser();
        if (!user) return null;

        return {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phoneNumbers[0]?.phoneNumber || null,
        };
    }

    getLoginUrl(redirectUrl?: string): string {
        return `/sign-in${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`;
    }

    getLogoutUrl(redirectUrl?: string): string {
        return `/sign-out${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`;
    }

    async requireRole(role: 'CLIENT' | 'TRAINER' | 'ADMIN'): Promise<boolean> {
        // In a real scenario, we check publicMetadata or local DB role
        // For now, we assume role check is handled via middleware or specific role-based logic
        // but this adapter provides a hook for it.
        const { sessionClaims } = await auth();
        const userRole = (sessionClaims?.metadata as any)?.role || 'CLIENT';

        return userRole === role;
    }
}

export const authService: AuthService = new ClerkAuthAdapter();
