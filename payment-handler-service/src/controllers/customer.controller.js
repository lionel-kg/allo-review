const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const {getUserSubscription} = require('../services/user.service');

exports.getCustomerSubscription = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const subscription = await getUserSubscription(userId);
    console.log(subscription);
    if (!subscription) {
      return res.status(404).send({message: 'Subscription not found'});
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.idStripe,
    );

    const subscriptionProduct = stripeSubscription.items.data[0].plan.product;
    const subscriptionPaymentMethod = stripeSubscription.default_payment_method;

    const subscriptionItem =
      await stripe.products.retrieve(subscriptionProduct);

    const paymentMethod = await stripe.paymentMethods.retrieve(
      subscriptionPaymentMethod,
    );

    return res.json({
      id: subscription.id,
      idStripe: subscription.idStripe,
      name: subscriptionItem.name,
      description: subscriptionItem.description,
      price: subscriptionItem.metadata.price,
      status: stripeSubscription.status,
      current_period_end: moment(
        stripeSubscription.current_period_end * 1000,
      ).format('DD MMMM YYYY'),
      cardNumber: `**** **** **** ${paymentMethod.card.last4}`,
    });
  } catch (error) {
    res.status(400).send({error: {message: error.message}});
  }
};
