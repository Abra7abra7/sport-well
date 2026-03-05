import { describe, it, expect, vi, beforeEach } from 'vitest';
import { matchTrainerForIssue } from './ai.service';
import prisma from '@/lib/db';

// Mock the DB and OpenAI env
vi.mock('@/lib/db', () => ({
    default: {
        user: {
            findMany: vi.fn(),
        },
    },
}));

describe('matchTrainerForIssue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.OPENAI_API_KEY = 'placeholder';
    });

    it('should return mock trainers when database connection fails', async () => {
        (prisma.user.findMany as any).mockRejectedValue(new Error('DB Connection Failed'));

        const results = await matchTrainerForIssue('bolí ma chrbát');

        expect(results).toHaveLength(1);
        expect(results[0].trainerId).toBe('mock-1');
        expect(results[0].reasoning).toContain('AI konfigurácia chýba');
    });

    it('should return mock trainers when no OpenAI key is provided', async () => {
        (prisma.user.findMany as any).mockResolvedValue([
            { id: 'real-1', firstName: 'Ján', lastName: 'Kováč', phone: '123' }
        ]);
        process.env.OPENAI_API_KEY = ''; // Missing key

        const results = await matchTrainerForIssue('bolí ma chrbát');

        expect(results).toHaveLength(1);
        expect(results[0].trainerId).toBe('real-1');
        expect(results[0].reasoning).toContain('AI konfigurácia chýba');
    });
});
