import { AIBookingForm } from "@/components/booking/ai-booking-form";

export default async function BookingPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="min-h-screen py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[#00287D] font-asap mb-4 uppercase tracking-tight">
                        Nová Rezervácia
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Využite silu umelej inteligencie. Popíšte svoj stav a my vás spojíme s odborníkom, ktorý vám najlepšie pomôže.
                    </p>
                </div>

                <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
                    <AIBookingForm />
                </section>
            </div>
        </main>
    );
}
