const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const userCount = await prisma.user.count();
        const trainerCount = await prisma.user.count({ where: { role: 'TRAINER' } });
        const trainers = await prisma.user.findMany({ where: { role: 'TRAINER' } });

        console.log('--- DB STATUS ---');
        console.log('Total Users:', userCount);
        console.log('Total Trainers:', trainerCount);
        console.log('Trainers:', trainers);
        console.log('-----------------');
    } catch (e) {
        console.error('DB Check failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
