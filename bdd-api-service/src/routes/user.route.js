const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../config/db.js');
const verifyToken = require('../middleware/verifyToken.js');
// Create User
router.post('/', async (req, res) => {
  try {
    const {username, password, email, idGoogle, idGithub, idDiscord} = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        idGoogle,
        idGithub,
        idDiscord,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Read Users
router.post('/exists', async (req, res) => {
  try {
    const users = await prisma.user.findFirst({
      where: {email: req.body.email},
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.post('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Update User
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const {username, password, email, idGoogle, idGithub, idDiscord, idStripe} =
      req.body;

    // Hash password if provided
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: {id: userId},
      data: {
        username,
        password: hashedPassword,
        email,
        idGoogle,
        idGithub,
        idDiscord,
        idStripe,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Delete user from the database
    await prisma.user.delete({
      where: {id: userId},
    });

    res.json({message: 'User deleted successfully'});
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Récupérer les films aimés par l'utilisateur
router.get('/:id/likes', verifyToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Utilisez Prisma Client pour obtenir les films aimés par l'utilisateur.
    const userWithLikes = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        likes: true, // Inclut les films que l'utilisateur aime
      },
    });

    res.status(200).json(userWithLikes.likes);
  } catch (error) {
    console.error('Error fetching user likes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Vérifie si un film est aimé par l'utilisateur
router.get('/:id/likes/:movieId', verifyToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const movieId = parseInt(req.params.movieId);

    // Vérifiez si le film est dans la liste des likes de l'utilisateur
    const likeExists = await prisma.user.findUnique({
      where: {id: userId},
      include: {
        likes: {
          where: {
            id: movieId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const isLiked = likeExists && likeExists.likes.length > 0;
    res.status(200).json({isLiked});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Abonnement d'un utilisateur
// Abonnement d'un utilisateur
router.get('/:id/subscription', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const subscription = await prisma.subscription.findUnique({
      where: {userId: userId},
    });
    console.log(subscription);
    if (!subscription) {
      return res.status(404).send({message: 'Subscription not found'});
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
