const express = require('express');
const router = express.Router();
const prisma = require('../config/db.js');

router.post('/', async (req, res) => {
  try {
    const subscriptionStripe = req.body.subscription;

    const subscription = await prisma.subscription.create({
      data: {
        user: {connect: {id: parseInt(req.body.userId)}},
        // idCustomerStripe: session.customer,
        idStripe: subscriptionStripe.id,
        status: subscriptionStripe.status,
        expiresAt: new Date(
          subscriptionStripe.current_period_end * 1000,
        ).toISOString(),
      },
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.put('/:id', async (req, res) => {
  try {
    const idStripe = req.params.id;
    const subscriptionStripe = req.body.subscription;

    // Vérifiez d'abord si l'abonnement existe
    const existingSubscription = await prisma.subscription.findUnique({
      where: {idStripe: idStripe},
    });

    if (!existingSubscription) {
      return res.status(404).json({error: 'Subscription not found'});
    }

    // Mise à jour de l'abonnement
    const updatedSubscription = await prisma.subscription.update({
      where: {idStripe: idStripe},
      data: {
        status: subscriptionStripe.status,
        expiresAt: new Date(
          subscriptionStripe.current_period_end * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const subscription = await prisma.subscription.findUnique({
      where: {id: parseInt(id)},
    });

    if (!subscription) {
      return res.status(404).json({error: 'Subscription not found'});
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = router;
