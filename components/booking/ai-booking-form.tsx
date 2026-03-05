'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { findTrainerMatches } from '@/app/actions/booking';
import { TrainerMatchResult } from '@/lib/services/ai.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
    issueDescription: z.string().min(10, {
        message: "Prosím, popíšte váš problém aspoň 10 znakmi.",
    }),
});

export function AIBookingForm() {
    const [matches, setMatches] = useState<TrainerMatchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            issueDescription: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('issueDescription', values.issueDescription);
            const results = await findTrainerMatches(formData);
            setMatches(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="issueDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-bold text-primary">Čo vás trápi?</FormLabel>
                                <FormDescription>
                                    Popíšte svoj problém vlastnými slovami. Naša AI vám nájde najvhodnejšieho trénera.
                                </FormDescription>
                                <FormControl>
                                    <Textarea
                                        placeholder="Napr.: Už týždeň ma bolí v krížoch pri dlhom sedení v práci..."
                                        className="min-h-[120px] text-lg"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? "Analyzujem..." : "Nájsť ideálneho trénera"}
                    </Button>
                </form>
            </Form>

            {matches.length > 0 && (
                <div className="grid gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Navrhovaní tréneri pre vás</h2>
                    {matches.map((match) => (
                        <Card key={match.trainerId} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Tréner #{match.trainerId.substring(0, 5)}</CardTitle>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                        Zhoda: {match.relevanceScore}%
                                    </span>
                                </div>
                                <CardDescription className="italic text-gray-600 mt-2">
                                    "{match.reasoning}"
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">Vybrať termín</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
