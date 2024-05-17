const axios = require('axios');
const moment = require('moment'); // Consider using a library like date-fns for more flexibility

async function updateSubscription(subscription) {
  try {
    const response = await axios.put(
      `${process.env.BDD_API_URL}/subscription/${subscription.id}`,
      {
        subscription,
      },
    );
    console.log('Subscription updated:', response.data);
  } catch (error) {
    console.error('Failed to update subscription:', error);
  }
}

async function saveSubscription(subscription, userId) {
  try {
    const response = await axios.post(
      `${process.env.BDD_API_URL}/subscription`,
      {
        subscription,
        userId,
      },
    );
    console.log('Subscription saved:', response.data);
  } catch (error) {
    console.error('Failed to save subscription:', error);
  }
}

async function sendSubscriptionEmail(customerEmail, subscription) {
  try {
    const formattedDate = moment(subscription.current_period_end * 1000).format(
      'DD/MM/YYYY',
    );
    const formattedPrice =
      (subscription.items.data[0].price.unit_amount_decimal / 100).toFixed(2) +
      '€';

    const response = await axios.post(`${process.env.MAIL_API_URL}/mail/send`, {
      toEmail: customerEmail,
      toName: 'test',
      duration: formattedDate,
      price: formattedPrice,
    });
    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

module.exports = {
  updateSubscription,
  saveSubscription,
  sendSubscriptionEmail,
};
