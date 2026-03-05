'use strict';

import { z } from 'zod';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const SessionNoteSchema = z.object({
    bookingId: z.string(),
    content: z.string().min(10, "Zápis musí mať aspoň 10 znakov."),
    attachments: z.array(z.string()).optional(),
});

export async function saveSessionNote(formData: { bookingId: string, content: string, attachments?: string[] }) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const trainer = await prisma.user.findUnique({ where: { clerkId } });
    if (!trainer || (trainer.role !== 'TRAINER' && trainer.role !== 'ADMIN')) {
        throw new Error("Only trainers or admins can save session notes");
    }

    const validated = SessionNoteSchema.parse(formData);

    // 1. Create the session note
    const note = await prisma.sessionNote.upsert({
        where: { bookingId: validated.bookingId },
        update: {
            content: validated.content,
            attachments: validated.attachments || [],
        },
        create: {
            bookingId: validated.bookingId,
            trainerId: trainer.id,
            content: validated.content,
            attachments: validated.attachments || [],
        }
    });

    // 2. Mark booking as completed
    await prisma.booking.update({
        where: { id: validated.bookingId },
        data: { status: 'COMPLETED' }
    });

    revalidatePath('/trainer/dashboard');
    return note;
}
