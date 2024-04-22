const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.create({
    data: {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$n9GP1cKWYGjM3F93Uc368O8WZyyciy38JF3UbO.5grV1LytimvcM.',
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
