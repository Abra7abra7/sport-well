import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrainerDashboard from './page';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}));

describe('TrainerDashboard', () => {
    it('should render mock profile when database connection fails', async () => {
        (auth as any).mockResolvedValue({ userId: 'trainer_123' });
        (prisma.user.findUnique as any).mockRejectedValue(new Error('DB Connection Failed'));

        const Result = await TrainerDashboard();
        render(Result);

        expect(screen.getByText(/Prehľad trénera/i)).toBeInTheDocument();
        expect(screen.getByText(/Vitajte späť, Hosť/i)).toBeInTheDocument();
    });
});
