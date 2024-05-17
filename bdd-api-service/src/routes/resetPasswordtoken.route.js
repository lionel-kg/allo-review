const express = require("express");
const router = express.Router();
const prisma = require("../config/db.js");


// CREATE: Créer un nouveau token de réinitialisation
router.post('/', async (req, res) => {
    try {
        const { token, email, expiration } = req.body;
        const newToken = await prisma.passwordResetToken.create({
            data: {
                token,
                email,
                expiration
            }
        });
        res.json(newToken);
    } catch (error) {
        console.error("Erreur lors de la création du token de réinitialisation :", error);
        res.status(500).json({ error: "Erreur lors de la création du token de réinitialisation" });
    }
});

// READ: Récupérer tous les tokens de réinitialisation
router.get('/', async (req, res) => {
    try {
        const tokens = await prisma.passwordResetToken.findMany();
        res.json(tokens);
    } catch (error) {
        console.error("Erreur lors de la récupération des tokens de réinitialisation :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des tokens de réinitialisation" });
    }
});

// READ: Récupérer un token de réinitialisation par son ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const token = await prisma.passwordResetToken.findUnique({
            where: {
                token: id
            }
        });
        if (token) {
            res.json(token);
        } else {
            res.status(404).json({ error: "Token de réinitialisation non trouvé" });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du token de réinitialisation :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du token de réinitialisation" });
    }
});

// DELETE: Supprimer un token de réinitialisation par son ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.passwordResetToken.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: "Token de réinitialisation supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du token de réinitialisation :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du token de réinitialisation" });
    }
});

// UPDATE: Mettre à jour un token de réinitialisation par son ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { token, email, expiration } = req.body;
    try {
        const updatedToken = await prisma.passwordResetToken.update({
            where: {
                token: id
            },
            data: {
                token,
                email,
                expiration
            }
        });
        res.json(updatedToken);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du token de réinitialisation :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du token de réinitialisation" });
    }
});

module.exports = router;
