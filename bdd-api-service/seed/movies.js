const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {apiTmdb} = require('../src/config/axios');
const {AddMovie} = require('../src/helpers/movie');

const requests = {
  popular: `/movie/popular`,
  top_rated: `/movie/top_rated`,
  now_playing: `/movie/now_playing`,
  upcoming: `/movie/upcoming`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
};

const main = async () => {
  await prisma.review.deleteMany({});
  await prisma.movie.deleteMany({});

  const appreciations = await prisma.appreciation.findMany({
    select: {
      id: true,
      title: true,
      min_score: true,
      max_score: true,
      min_magnitude: true,
      max_magnitude: true,
    },
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      movies: true,
    },
  });

  for (const [key, value] of Object.entries(requests)) {
    try {
      const movies = (await apiTmdb.get(value))?.data?.results;
      const category = categories.find(category => category.name === key);

      for (const movie of movies) {
        const movieAdded = await AddMovie(movie, appreciations);

        if (movieAdded && category) {
          const categoryExists = movieAdded?.categories?.some(
            category => category.id === category.id,
          );

          if (!categoryExists) {
            const movieUpdated = await prisma.movie.update({
              where: {tmdb_id: movieAdded.tmdb_id},
              data: {
                categories: {
                  connect: {id: category.id},
                },
              },
            });

            console.log(
              `Movie updated with categories: movie.id:${movieUpdated.id} category.id${category.id}`,
            );
          } else {
            console.log('Category is already linked to this movie.');
          }
        }
      }
    } catch (error) {
      console.error(`Failed to process ${key} provisioning: ${error.message}`);
    }
  }
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
