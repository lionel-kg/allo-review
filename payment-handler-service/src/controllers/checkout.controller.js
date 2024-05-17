const stripe = require('stripe')(process.env.STRIPE_KEY);
const DOMAIN = process.env.DOMAIN;
const {updateUser, getUser} = require('../services/user.service');

exports.createCheckoutSession = async (req, res) => {
  try {
    let customer;

    if (req.body.user && req.body.user.idStripe) {
      customer = await stripe.customers.retrieve(req.body.user.idStripe);
    } else {
      customer = await stripe.customers.create({
        email: req.body.user.email,
        metadata: {
          userId: req.body.user.id,
          // name: req.body.user.name
        },
      });

      await updateUser(req.body.user, customer.id);
    }
    // Définir la période d'essai
    const trialDays = req.body.isTrial ? 7 : 0;

    const sessionParams = {
      payment_method_types: ['card'],
      customer: customer.id,
      mode: 'subscription',
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/account`,
      cancel_url: `${process.env.DOMAIN}/account`,

      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      },
    };

    // Ajouter conditionnellement la période d'essai si elle est spécifiée
    if (trialDays) {
      sessionParams.subscription_data.trial_period_days = trialDays;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({sessionId: session.id});
  } catch (error) {
    res.status(400).send({error: {message: error.message}});
  }
};

exports.createPortalSession = async (req, res) => {
  try {
    const returnUrl = `${DOMAIN}/account`;
    const userEmail = req.userToken.email;
    const user = await getUser(userEmail);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.idStripe,
      return_url: returnUrl,
    });
    res.status(200).json({url: portalSession.url});
  } catch (error) {
    res.status(400).send({error: {message: error.message}});
  }
};
