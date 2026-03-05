import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveSessionNote } from './trainer';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
        sessionNote: {
            upsert: vi.fn(),
        },
        booking: {
            update: vi.fn(),
        },
    },
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('saveSessionNote', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should save note and complete booking', async () => {
        (auth as any).mockResolvedValue({ userId: 'clerk_t1' });
        (prisma.user.findUnique as any).mockResolvedValue({ id: 'db_t1', role: 'TRAINER' });
        (prisma.sessionNote.upsert as any).mockResolvedValue({ id: 'note_1' });

        const result = await saveSessionNote({
            bookingId: 'b_1',
            content: 'Client did great in today\'s session.',
        });

        expect(result.id).toBe('note_1');
        expect(prisma.booking.update).toHaveBeenCalledWith({
            where: { id: 'b_1' },
            data: { status: 'COMPLETED' },
        });
        expect(revalidatePath).toHaveBeenCalledWith('/trainer/dashboard');
    });

    it('should throw if user is not a trainer', async () => {
        (auth as any).mockResolvedValue({ userId: 'clerk_c1' });
        (prisma.user.findUnique as any).mockResolvedValue({ id: 'db_c1', role: 'CLIENT' });

        await expect(saveSessionNote({
            bookingId: 'b_1',
            content: 'This should fail',
        })).rejects.toThrow('Only trainers or admins can save session notes');
    });
});
