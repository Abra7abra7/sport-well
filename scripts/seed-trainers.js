const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    try {
        console.log('Seeding trainers...');

        await prisma.user.upsert({
            where: { email: 'michal.fyzio@sportwell.sk' },
            update: {},
            create: {
                email: 'michal.fyzio@sportwell.sk',
                clerkId: 'trainer_1_mock',
                firstName: 'Michal',
                lastName: 'Fyzio',
                role: 'TRAINER',
                phone: '0900111222'
            }
        });

        await prisma.user.upsert({
            where: { email: 'zuzana.pohyb@sportwell.sk' },
            update: {},
            create: {
                email: 'zuzana.pohyb@sportwell.sk',
                clerkId: 'trainer_2_mock',
                firstName: 'Zuzana',
                lastName: 'Pohyb',
                role: 'TRAINER',
                phone: '0900333444'
            }
        });

        console.log('Seed complete.');
    } catch (e) {
        console.error('Seed failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
