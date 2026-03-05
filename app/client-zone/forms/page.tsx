import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, CircleDashed } from "lucide-react";

export default async function ClientFormsPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return <div>Unauthorized</div>;

    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { diagnosticForms: true }
    });

    if (!user) return <div>User not found</div>;

    const forms = [
        { type: 'GDPR', title: 'Súhlas so spracovaním údajov (GDPR)', description: 'Nevyhnutné pred prvou návštevou.' },
        { type: 'INITIAL_DIAGNOSTIC', title: 'Vstupný diagnostický dotazník', description: 'Pomôže nám lepšie sa pripraviť na vaše prvé stretnutie.' }
    ];

    const getStatus = (type: string) => {
        return user.diagnosticForms.some(f => f.formType === type);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-[#00287D] font-asap tracking-wide uppercase">Moje Dokumenty</h1>
                <p className="text-gray-600">Dokončite prosím nasledujúce formuláre pred vaším tréningom.</p>
            </div>

            <div className="grid gap-6">
                {forms.map((form) => {
                    const isDone = getStatus(form.type);
                    return (
                        <Card key={form.type} className={`border-l-4 transition-all ${isDone ? 'border-l-green-500 bg-green-50/30' : 'border-l-amber-500 hover:shadow-md'}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">{form.title}</CardTitle>
                                    <p className="text-sm text-gray-500">{form.description}</p>
                                </div>
                                {isDone ? (
                                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                                ) : (
                                    <CircleDashed className="h-8 w-8 text-amber-500 animate-pulse" />
                                )}
                            </CardHeader>
                            {!isDone && (
                                <CardContent>
                                    <Link href={`/client-zone/forms/fill/${form.type}`}>
                                        <Button className="w-full bg-primary text-white font-bold">Vyplniť teraz</Button>
                                    </Link>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
