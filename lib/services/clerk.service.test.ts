import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClerkAuthAdapter } from './clerk.service';
import { currentUser, auth } from '@clerk/nextjs/server';

vi.mock('@clerk/nextjs/server', () => ({
    currentUser: vi.fn(),
    auth: vi.fn(),
}));

describe('ClerkAuthAdapter', () => {
    const adapter = new ClerkAuthAdapter();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return mapped user details when logged in', async () => {
        const mockClerkUser = {
            id: 'clerk_123',
            emailAddresses: [{ emailAddress: 'jan@example.com' }],
            firstName: 'Jan',
            lastName: 'Kovac',
            phoneNumbers: [{ phoneNumber: '+421900' }],
        };
        (currentUser as any).mockResolvedValue(mockClerkUser);

        const result = await adapter.getCurrentUser();

        expect(result).toEqual({
            id: 'clerk_123',
            email: 'jan@example.com',
            firstName: 'Jan',
            lastName: 'Kovac',
            phone: '+421900',
        });
    });

    it('should return null when no user', async () => {
        (currentUser as any).mockResolvedValue(null);
        const result = await adapter.getCurrentUser();
        expect(result).toBeNull();
    });

    it('should generate correct login URL', () => {
        expect(adapter.getLoginUrl('/dashboard')).toBe('/sign-in?redirect_url=%2Fdashboard');
    });

    it('should verify role correctly', async () => {
        (auth as any).mockResolvedValue({
            sessionClaims: { metadata: { role: 'TRAINER' } }
        });

        const isTrainer = await adapter.requireRole('TRAINER');
        const isAdmin = await adapter.requireRole('ADMIN');

        expect(isTrainer).toBe(true);
        expect(isAdmin).toBe(false);
    });
});
