const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.create({
    data: {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    },
  });

  await prisma.member.create({
    data: {
      userId: user.id,
      email: 'john@example.com',
    },
  });

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
