import OpenAI from 'openai';
import prisma from '@/lib/db';

// Lazy-initialize OpenAI client to prevent crash on module evaluation if key is missing
let _openai: OpenAI | null = null;

function getOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('placeholder')) {
        return null;
    }
    if (!_openai) {
        _openai = new OpenAI({
            apiKey: apiKey,
        });
    }
    return _openai;
}

export interface TrainerMatchResult {
    trainerId: string;
    relevanceScore: number;
    reasoning: string;
}

export async function matchTrainerForIssue(clientIssue: string): Promise<TrainerMatchResult[]> {
    // 1. Get all trainers from DB with graceful fallback
    let trainers = [];
    try {
        trainers = await prisma.user.findMany({
            where: { role: 'TRAINER' },
            select: { id: true, firstName: true, lastName: true, phone: true }
        });
    } catch (dbError) {
        console.error('Database connection failed, using mock trainers:', dbError);
        trainers = [
            { id: 'mock-1', firstName: 'Michal', lastName: 'Fyzio', phone: '0900111222' },
            { id: 'mock-2', firstName: 'Zuzana', lastName: 'Pohyb', phone: '0900333444' }
        ];
    }

    if (trainers.length === 0) {
        // Fallback if DB is connected but empty
        trainers = [{ id: 'mock-1', firstName: 'Michal', lastName: 'Fyzio', phone: '0900111222' }];
    }

    // 2. Simple AI matching logic
    const openai = getOpenAIClient();

    if (!openai) {
        console.warn('OpenAI API key missing or invalid. Falling back to default trainer.');
        return [{
            trainerId: trainers[0].id,
            relevanceScore: 50,
            reasoning: "Automatické priradenie (AI konfigurácia chýba)."
        }];
    }

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
