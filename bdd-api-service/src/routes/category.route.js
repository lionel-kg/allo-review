const express = require("express");
const router = express.Router();
const prisma = require("../config/db.js");

// Create Category
// router.post('/', async (req, res) => {
//   try {
//     const category = await prisma.category.create({
//       data: req.body,
//       include: {
//         movies: true // Include associated movies
//       }
//     });
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not create category' });
//   }
// });

// Get All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        movies: true, // Include associated movies
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve categories" });
  }
});

// Get Category by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        movies: true, // Include associated movies
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve category" });
  }
});

// Update Category
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updatedCategory = await prisma.category.update({
//       where: { id: parseInt(id) },
//       data: req.body,
//       include: {
//         movies: true // Include associated movies
//       }
//     });
//     res.json(updatedCategory);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not update category' });
//   }
// });

// Delete Category
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.category.delete({
//       where: { id: parseInt(id) }
//     });
//     res.json({ message: 'Category deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Could not delete category' });
//   }
// });

module.exports = router;
