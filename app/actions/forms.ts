'use strict';

import { z } from 'zod';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const DiagnosticFormSchema = z.object({
    formType: z.enum(['GDPR', 'INITIAL_DIAGNOSTIC']),
    formData: z.any(),
});

export async function submitDiagnosticForm(formType: 'GDPR' | 'INITIAL_DIAGNOSTIC', formData: any) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error("User not found in DB");

    const entry = await prisma.diagnosticForm.create({
        data: {
            userId: user.id,
            formType,
            formData,
        }
    });

    revalidatePath('/client-zone/forms');
    return entry;
}
