'use client';

import { useState } from 'react';
import { saveSessionNote } from '@/app/actions/trainer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function SessionNoteForm({ bookingId, clientName }: { bookingId: string, clientName: string }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSave() {
        setLoading(true);
        try {
            await saveSessionNote({ bookingId, content });
            router.push('/trainer/dashboard');
        } catch (error) {
            console.error(error);
            alert("Chyba pri ukladaní zápisu.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-3xl mx-auto shadow-2xl border-t-8 border-t-[#00287D]">
            <CardHeader>
                <CardTitle className="text-2xl text-gray-900 uppercase font-asap tracking-wide">
                    Zápis z terapie: {clientName}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                        Diagnostika a priebeh sedenia
                    </label>
                    <Textarea
                        placeholder="Zapíšte si dôležité zistenia, vykonané cviky a odporúčania pre klienta..."
                        className="min-h-[300px] text-lg leading-relaxed focus:ring-[#00287D] border-gray-200"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        className="flex-1 bg-primary py-6 text-lg font-bold"
                        onClick={handleSave}
                        disabled={loading || content.length < 10}
                    >
                        {loading ? "Ukladám..." : "Ukončiť a uložiť sedenie"}
                    </Button>
                    <Button variant="outline" className="py-6" onClick={() => router.back()}>
                        Späť
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
