const express = require("express");
const router = express.Router();
const prisma = require("../config/db.js");

// Create Genre
// router.post('/', async (req, res) => {
//   try {
//     const genre = await prisma.genre.create({
//       data: req.body,
//       include: {
//         movies: true // Include associated movies
//       }
//     });
//     res.json(genre);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not create genre' });
//   }
// });

// Get All Genres
router.get("/", async (req, res) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        movies: true, // Include associated movies
      },
    });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve genres" });
  }
});

// Get Genre by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: parseInt(id) },
      include: {
        movies: true, // Include associated movies
      },
    });
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve genre" });
  }
});

// Update Genre
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updatedGenre = await prisma.genre.update({
//       where: { id: parseInt(id) },
//       data: req.body,
//       include: {
//         movies: true // Include associated movies
//       }
//     });
//     res.json(updatedGenre);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not update genre' });
//   }
// });

// // Delete Genre
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.genre.delete({
//       where: { id: parseInt(id) }
//     });
//     res.json({ message: 'Genre deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Could not delete genre' });
//   }
// });

module.exports = router;
