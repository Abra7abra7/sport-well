import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import SessionNoteForm from "@/components/trainer/session-note-form";

export default async function SessionPage({ params }: { params: Promise<{ lang: string; bookingId: string }> }) {
    const { bookingId } = await params;
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { client: true }
    });


    if (!booking) notFound();

    return (
        <main className="min-h-screen py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <SessionNoteForm
                    bookingId={booking.id}
                    clientName={`${booking.client.firstName} ${booking.client.lastName}`}
                />
            </div>
        </main>
    );
}
