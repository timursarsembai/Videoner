import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@localhost';
  // В проде ключ задаётся через SEED_API_KEY, чтобы совпадал у server/web/bot.
  // Локально (без переменной) генерируется случайный при первом запуске.
  const desiredKey = process.env.SEED_API_KEY;

  const user = await prisma.user.upsert({
    where: { email },
    update: { isAdmin: true, isBlocked: false },
    create: { email, name: 'Local Admin', isAdmin: true },
  });

  // Если задан фиксированный ключ — гарантируем, что он есть в БД (идемпотентно).
  if (desiredKey) {
    const existing = await prisma.apiKey.findUnique({
      where: { key: desiredKey },
    });
    if (!existing) {
      const apiKey = await prisma.apiKey.create({
        data: {
          key: desiredKey,
          name: 'primary',
          userId: user.id,
          rateLimit: 1000,
          maxDuration: 14400, // 240 минут (4 часа)
        },
      });
      console.log('Admin user:', user.email);
      console.log('API key:', apiKey.key);
      return;
    }
    console.log('Admin user:', user.email);
    console.log('API key already present:', existing.key);
    return;
  }

  let apiKey = await prisma.apiKey.findFirst({
    where: { userId: user.id, isBlocked: false },
  });

  if (!apiKey) {
    apiKey = await prisma.apiKey.create({
      data: {
        key: `dk_${randomBytes(32).toString('hex')}`,
        name: 'local-admin',
        userId: user.id,
        rateLimit: 1000,
        maxDuration: 14400, // 240 минут (4 часа)
      },
    });
  }

  console.log('Admin user:', user.email);
  console.log('API key:', apiKey.key);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
