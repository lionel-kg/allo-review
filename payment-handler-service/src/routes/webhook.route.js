const express = require('express');
const router = express.Router();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT;
const {
  updateSubscription,
  saveSubscription,
  sendSubscriptionEmail,
} = require('../services/subscription.service');

router.post('/webhook', async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const session = event.data.object;
  let subscription;
  let customer;

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.updated':
      customer = await stripe.customers.retrieve(session.customer);
      //Vérifie si l'abonnement a été annulé
      // if (session.cancel_at_period_end) {
      //   await sendEmailSubscriptionCanceled(session.customer.email, session);
      // }
      //Vérifie si l'abonnement a été renouvelé
      // elseif (!session.current_period_end) {
      //   await sendEmailSubscriptionRenewed(session.customer.email, session);
      // }

      await updateSubscription(session);
      break;
    case 'checkout.session.completed':
      subscription = await stripe.subscriptions.retrieve(session.subscription);
      customer = await stripe.customers.retrieve(session.customer);
      await saveSubscription(subscription, customer.metadata.userId);
      break;
    case 'invoice.paid':
      subscription = await stripe.subscriptions.retrieve(session.subscription);

      await updateSubscription(subscription);

      await sendSubscriptionEmail(session.customer_email, subscription);

      break;
    case 'invoice.payment_failed':
      subscription = await stripe.subscriptions.retrieve(session.subscription);
      await updateSubscription(subscription);
      // await sendSubscriptionFailedEmail(session.customer_email, subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  response.send();
});

module.exports = router;
