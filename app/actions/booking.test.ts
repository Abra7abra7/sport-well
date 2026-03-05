import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findTrainerMatches, createBooking } from './booking';
import { auth } from '@clerk/nextjs/server';
import { matchTrainerForIssue } from '@/lib/services/ai.service';
import prisma from '@/lib/db';

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}));

vi.mock('@/lib/services/ai.service', () => ({
    matchTrainerForIssue: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
        booking: {
            create: vi.fn(),
        },
    },
}));

describe('Booking Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('findTrainerMatches', () => {
        it('should throw Unauthorized if no user', async () => {
            (auth as any).mockResolvedValue({ userId: null });
            const formData = new FormData();
            await expect(findTrainerMatches(formData)).rejects.toThrow('Unauthorized');
        });

        it('should return matches for valid input', async () => {
            (auth as any).mockResolvedValue({ userId: 'user_1' });
            const mockMatches = [{ trainerId: 't1', relevanceScore: 90, reasoning: 'test' }];
            (matchTrainerForIssue as any).mockResolvedValue(mockMatches);

            const formData = new FormData();
            formData.append('issueDescription', 'Bolí ma koleno pri behu');

            const result = await findTrainerMatches(formData);
            expect(result).toEqual(mockMatches);
        });
    });

    describe('createBooking', () => {
        it('should create a booking in the database', async () => {
            (auth as any).mockResolvedValue({ userId: 'clerk_1' });
            (prisma.user.findUnique as any).mockResolvedValue({ id: 'db_1' });
            (prisma.booking.create as any).mockResolvedValue({ id: 'b_1', status: 'PENDING' });

            const startTime = new Date();
            const result = await createBooking('t1', startTime, 'Back pain');

            expect(result.id).toBe('b_1');
            expect(prisma.booking.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    clientId: 'db_1',
                    trainerId: 't1',
                    notes: 'Back pain'
                })
            }));
        });
    });
});
