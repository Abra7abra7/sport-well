import OpenAI from 'openai';
import prisma from '@/lib/db';

// Multi-provider configuration from ENV
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // openai, mistral, deepseek, etc.
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';
const AI_BASE_URL = process.env.AI_BASE_URL; // For non-OpenAI standard endpoints

let _aiClient: OpenAI | null = null;

function getAIClient() {
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('placeholder')) {
        return null;
    }

    if (!_aiClient) {
        _aiClient = new OpenAI({
            apiKey: apiKey,
            baseURL: AI_BASE_URL || undefined, // Use custom base URL if provided
        });
    }
    return _aiClient;
}

export interface TrainerMatchResult {
    trainerId: string;
    trainerName?: string;
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
        trainers = [{ id: 'mock-1', firstName: 'Michal', lastName: 'Fyzio', phone: '0900111222' }];
    }

    // 2. AI matching logic
    const client = getAIClient();

    if (!client) {
        console.warn('AI API key missing or invalid. Falling back to default trainer.');
        return [{
            trainerId: trainers[0].id,
            relevanceScore: 50,
            reasoning: "Automatické priradenie (AI konfigurácia chýba)."
        }];
    }

    const trainerProfiles = trainers.map(t => `${t.firstName} ${t.lastName} (ID: ${t.id})`).join('\n');

    const prompt = `
    You are an expert medical triage assistant for SportWell Physiotherapy Clinic in Bratislava.
    A client described their issue as: "${clientIssue}"

    Here are the available trainers:
    ${trainerProfiles}

    Based on the client's issue, select the top 3 most suitable trainers.
    IMPORTANT: You must return a valid JSON object with a key "matches" containing an array of objects.
    Each object in the array must have: "trainerId", "trainerName", "relevanceScore" (0-100), and "reasoning" (short explanation in Slovak).
  `;

    try {
        const options: any = {
            model: AI_MODEL,
            messages: [{ role: 'user', content: prompt }],
        };

        // Only add response_format if using OpenAI (Mistral/others might fail on this)
        if (AI_PROVIDER === 'openai') {
            options.response_format = { type: 'json_object' };
        }

        const response = await client.chat.completions.create(options);

        let content = response.choices[0].message.content;
        if (!content) return [];

        console.log(`[AI Response] Received length: ${content.length}`);

        // Robust JSON extraction (removes markdown backticks if present)
        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0];
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0];
        }

        const parsed = JSON.parse(content.trim());
        console.log(`[AI Response] Parsed successfully.`);

        // Handle different possible structures
        const results = parsed.matches || parsed.trainers || (Array.isArray(parsed) ? parsed : []);

        if (!Array.isArray(results) || results.length === 0) {
            throw new Error('AI returned empty or invalid results structure');
        }

        // Deduplicate and enrich
        const uniqueMatches: TrainerMatchResult[] = [];
        const seenIds = new Set();

        for (const m of results) {
            if (m.trainerId && !seenIds.has(m.trainerId)) {
                seenIds.add(m.trainerId);
                const trainer = trainers.find(t => t.id === m.trainerId);
                uniqueMatches.push({
                    trainerId: m.trainerId,
                    trainerName: m.trainerName || (trainer ? `${trainer.firstName} ${trainer.lastName}` : undefined),
                    relevanceScore: m.relevanceScore || 50,
                    reasoning: m.reasoning || "Vhodný špecialista na váš problém."
                });
            }
        }

        return uniqueMatches.length > 0 ? uniqueMatches : results;
    } catch (error) {
        console.error(`AI Matching failed (${AI_PROVIDER}):`, error);
        // Fallback: return first trainer
        return [{
            trainerId: trainers[0].id,
            trainerName: `${trainers[0].firstName} ${trainers[0].lastName}`,
            relevanceScore: 50,
            reasoning: "Automatické priradenie (chyba pri spracovaní AI)."
        }];
    }
}
