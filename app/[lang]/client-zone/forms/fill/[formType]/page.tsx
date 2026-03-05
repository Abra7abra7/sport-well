import { notFound } from "next/navigation";
import GDPRForm from "@/components/forms/gdpr-form";

export default async function FormFillPage({ params }: { params: Promise<{ lang: string; formType: string }> }) {
    const { formType } = await params;
    if (formType !== 'GDPR' && formType !== 'INITIAL_DIAGNOSTIC') {
        notFound();
    }


    return (
        <main className="min-h-screen py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                {formType === 'GDPR' ? (
                    <GDPRForm />
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold">Vstupná diagnostika</h2>
                        <p className="text-gray-500">Tento modul sa pripravuje...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
