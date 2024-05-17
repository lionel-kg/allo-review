const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "top_rated",
    },
    {
      name: "popular",
    },
    {
      name: "upcoming",
    },
    {
      name: "now_playing",
    },
  ];

  console.log(`Seeding ${categories.length} categories...`);
  await prisma.review.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.appreciation.deleteMany({});

  for (let category of categories) {
    try {
      await prisma.category.create({ data: category });
    } catch (innerMovieError) {
      console.error(
        `Error processing category ${category.id}: ${innerMovieError.message}`
      );
    }
  }
  console.log(`Seeded ${categories.length} categories successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
