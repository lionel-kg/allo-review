const express = require('express');
const router = express.Router();
const prisma = require('../config/db.js');
const moment = require('moment');

// Create Code
router.post('/', async (req, res) => {
  try {
    const {code} = req.body;
    const expireDate = moment().add(10, 'minutes').toDate();
    // Create code in the database
    console.log(code, expireDate);
    const createdCode = await prisma.code.create({
      data: {
        code: code,
        expiredate: expireDate,
      },
    });

    res.json(createdCode);
  } catch (error) {
    console.error('Error creating code:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Read Codes
router.get('/', async (req, res) => {
  try {
    const codes = await prisma.code.findMany();
    res.json(codes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Update Code
router.put('/:id', async (req, res) => {
  try {
    const codeId = parseInt(req.params.id);
    const {code, expireDate} = req.body;

    // Update code in the database
    const updatedCode = await prisma.code.update({
      where: {id: codeId},
      data: {
        code,
        expiredate: expireDate,
      },
    });

    res.json(updatedCode);
  } catch (error) {
    console.error('Error updating code:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Delete Code
router.delete('/:id', async (req, res) => {
  try {
    const codeId = parseInt(req.params.id);

    // Delete code from the database
    await prisma.code.delete({
      where: {id: codeId},
    });

    res.json({message: 'Code deleted successfully'});
  } catch (error) {
    console.error('Error deleting code:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.post('/verify', async (req, res) => {
  const {code} = req.body;

  try {
    // Rechercher le code dans la base de données
    const existingCode = await prisma.code.findFirst({
      where: {
        code: code,
      },
    });
    if (!existingCode) {
      // Le code n'existe pas dans la base de données
      return res.status(404).json({error: 'Code invalide.'});
    }
    // Vérifier si le code a expiré
    const now = moment();
    const expireDate = moment(existingCode.expiredate);

    if (now.isAfter(expireDate)) {
      // Le code a expiré
      return res.status(400).json({error: 'Code expiré.'});
    }
    // Le code est valide
    return res.status(200).json({isValide: true});
  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    return res
      .status(500)
      .json({error: 'Erreur lors de la vérification du code.'});
  }
});
module.exports = router;
