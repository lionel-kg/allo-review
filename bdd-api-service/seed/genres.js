const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { apiTmdb } = require("../src/config/axios");

const main = async () => {
  console.log("Starting the genre seeding process...");
  try {
    await Promise.all(
      ["movie", "tv"].map(async (endpoint) => {
        const response = await apiTmdb.get(`genre/${endpoint}/list`);
        const genres = response.data.genres;

        console.log(`Processing ${genres.length} genres from ${endpoint}...`);

        for (const genre of genres) {
          const genreExists = await prisma.genre.findUnique({
            where: { tmdb_id: genre.id },
          });

          if (!genreExists) {
            const genreMovie = {
              tmdb_id: genre.id,
              name: genre.name,
            };
            await prisma.genre.create({ data: genreMovie });
            console.log(`Genre created: ${genre.name} (ID: ${genre.id})`);
          } else {
            console.log(
              `Genre already exists: ${genre.name} (ID: ${genre.id})`
            );
          }
        }

        console.log(`Completed seeding genres from ${endpoint}.`);
      })
    );
  } catch (e) {
    console.error(`Error during the genre seeding process:`, e);
    throw e;
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
};

main().catch((e) => {
  console.error("Unhandled error in main:", e);
  process.exit(1);
});
