import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitDiagnosticForm } from './forms';
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
        diagnosticForm: {
            create: vi.fn(),
        },
    },
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('submitDiagnosticForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully submit a form', async () => {
        (auth as any).mockResolvedValue({ userId: 'clerk_1' });
        (prisma.user.findUnique as any).mockResolvedValue({ id: 'db_1' });
        (prisma.diagnosticForm.create as any).mockResolvedValue({ id: 'form_1' });

        const result = await submitDiagnosticForm('GDPR', { consented: true });

        expect(result.id).toBe('form_1');
        expect(prisma.diagnosticForm.create).toHaveBeenCalledWith({
            data: {
                userId: 'db_1',
                formType: 'GDPR',
                formData: { consented: true },
            },
        });
        expect(revalidatePath).toHaveBeenCalledWith('/client-zone/forms');
    });

    it('should throw if not logged in', async () => {
        (auth as any).mockResolvedValue({ userId: null });
        await expect(submitDiagnosticForm('GDPR', {})).rejects.toThrow('Unauthorized');
    });
});
