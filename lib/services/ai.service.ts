import OpenAI from 'openai';
import prisma from '@/lib/db';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface TrainerMatchResult {
    trainerId: string;
    relevanceScore: number;
    reasoning: string;
}

export async function matchTrainerForIssue(clientIssue: string): Promise<TrainerMatchResult[]> {
    // 1. Get all trainers from DB
    const trainers = await prisma.user.findMany({
        where: { role: 'TRAINER' },
        select: { id: true, firstName: true, lastName: true, phone: true } // In reality we'd have bio/specialties
    });

    if (trainers.length === 0) return [];

    // 2. Simple AI matching logic
    // In a full implementation, we'd pass trainer specialties/bios to GPT
    const trainerProfiles = trainers.map(t => `${t.firstName} ${t.lastName} (ID: ${t.id})`).join('\n');

    const prompt = `
    You are an expert medical triage assistant for SportWell Physiotherapy Clinic.
    A client described their issue as: "${clientIssue}"

    Here are the available trainers:
    ${trainerProfiles}

    Based on the client's issue, select the top 3 most suitable trainers.
    Return a JSON array of objects with keys: "trainerId", "relevanceScore" (0-100), and "reasoning" (short explanation in Slovak).
  `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) return [];

        const parsed = JSON.parse(content);
        return parsed.matches || []; // Adjust based on exact GPT response structure
    } catch (error) {
        console.error('AI Matching failed:', error);
        // Fallback: return first trainer
        return [{
            trainerId: trainers[0].id,
            relevanceScore: 50,
            reasoning: "Automatické priradenie (AI nedostupná)."
        }];
    }
}
