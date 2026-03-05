'use server';

import { z } from 'zod';
import { matchTrainerForIssue } from '@/lib/services/ai.service';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const BookingSchema = z.object({
    issueDescription: z.string().min(10, "Popis problému musí mať aspoň 10 znakov."),
});

export async function findTrainerMatches(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const rawData = {
        issueDescription: formData.get('issueDescription'),
    };

    const validated = BookingSchema.parse(rawData);

    // Call the AI matching service
    const matches = await matchTrainerForIssue(validated.issueDescription);

    return matches;
}

export async function createBooking(trainerId: string, startTime: Date, issueDescription: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error("User not found in DB");

    const booking = await prisma.booking.create({
        data: {
            clientId: user.id,
            trainerId,
            startTime,
            endTime: new Date(startTime.getTime() + 60 * 60 * 1000), // Default 1 hour
            notes: issueDescription,
            status: 'PENDING',
        }
    });

    return booking;
}
