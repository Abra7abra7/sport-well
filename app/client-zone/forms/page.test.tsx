import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClientFormsPage from './page';
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

describe('ClientFormsPage', () => {
    it('should render mock data when database connection fails', async () => {
        (auth as any).mockResolvedValue({ userId: 'user_123' });
        (prisma.user.findUnique as any).mockRejectedValue(new Error('DB Connection Failed'));

        const Result = await ClientFormsPage();
        render(Result);

        expect(screen.getByText(/Moje Dokumenty/i)).toBeInTheDocument();
        expect(screen.getByText(/Súhlas so spracovaním údajov/i)).toBeInTheDocument();
    });
});
