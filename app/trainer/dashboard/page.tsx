import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TrainerDashboard() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return <div>Unauthorized</div>;

    const trainer = await prisma.user.findUnique({
        where: { clerkId },
        include: {
            bookingsAsTrainer: {
                where: { status: 'CONFIRMED' },
                include: { client: true },
                orderBy: { startTime: 'asc' }
            }
        }
    });

    if (!trainer) return <div>Prístup odmietnutý. Kontaktujte administrátora.</div>;

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#00287D]">Prehľad trénera</h1>
                    <p className="text-gray-600">Vitajte späť, {trainer.firstName}. Tu sú vaše dnešné termíny.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline">Kalendár</Button>
                    <Button>Nový klient</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainer.bookingsAsTrainer.length > 0 ? (
                    trainer.bookingsAsTrainer.map((booking) => (
                        <Card key={booking.id} className="shadow-sm border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex justify-between">
                                    <span>{booking.client.firstName} {booking.client.lastName}</span>
                                    <span className="text-sm text-gray-400 font-normal">
                                        {booking.startTime.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg italic">
                                    "{booking.notes || "Nebol zadaný žiadny problém."}"
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/trainer/session/${booking.id}`} className="w-full">
                                        <Button variant="default" className="w-full bg-primary">Začať sedenie</Button>
                                    </Link>
                                    <Button variant="outline">Profil</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400">Momentálne nemáte žiadne naplánované termíny.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
