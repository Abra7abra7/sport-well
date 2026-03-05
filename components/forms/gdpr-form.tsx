'use client';

import { useState } from 'react';
import { submitDiagnosticForm } from '@/app/actions/forms';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function GDPRForm() {
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
        setLoading(true);
        try {
            await submitDiagnosticForm('GDPR', { agreedAt: new Date().toISOString(), platform: 'Web' });
            router.push('/client-zone/forms');
        } catch (error) {
            console.error(error);
            alert("Chyba pri ukladaní.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto border-t-8 border-t-green-500">
            <CardHeader>
                <CardTitle className="text-2xl font-asap">Súhlas so spracovaním osobných údajov</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="prose prose-sm text-gray-600 space-y-4">
                    <p>
                        V súlade s nariadením GDPR udeľujem súhlas prevádzkovateľovi SportWell s.r.o. so spracovaním mojich osobných a zdravotných údajov za účelom poskytovania fyzioterapeutických služieb.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Údaje nebudú poskytnuté tretím stranám bez vášho vedomia.</li>
                        <li>Zdravotná dokumentácia je uchovávaná v zabezpečenom šifrovanom systéme.</li>
                        <li>Máte právo na prístup, opravu alebo vymazanie svojich údajov.</li>
                    </ul>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Checkbox id="terms" checked={agreed} onCheckedChange={(val) => setAgreed(!!val)} />
                    <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                        Potvrdzujem, že som si prečítal/a podmienky a súhlasím so spracovaním mojich údajov.
                    </label>
                </div>

                <div className="flex gap-4">
                    <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 font-bold"
                        disabled={!agreed || loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Ukladám..." : "Podpísať a odoslať súhlas"}
                    </Button>
                    <Button variant="ghost" onClick={() => router.back()}>Zrušiť</Button>
                </div>
            </CardContent>
        </Card>
    );
}
