const axios = require('axios');
const moment = require('moment'); // Consider using a library like date-fns for more flexibility

async function sendMailSubscriptionConfirmed(customerEmail, subscription) {
  try {
    const formattedDate = moment(subscription.current_period_end * 1000).format(
      'DD/MM/YYYY',
    );
    const formattedPrice =
      (subscription.items.data[0].price.unit_amount_decimal / 100).toFixed(2) +
      '€';

    await axios.post(`${process.env.MAIL_API_URL}/mail/send`, {
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

async function sendMailSubscriptionCanceled(customerEmail, subscription) {
  try {
    const formattedDate = moment(subscription.current_period_end * 1000).format(
      'DD/MM/YYYY',
    );
    const formattedPrice =
      (subscription.items.data[0].price.unit_amount_decimal / 100).toFixed(2) +
      '€';

    await axios.post(`${process.env.MAIL_API_URL}/mail/send`, {
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

module.exports = {sendMailSubscriptionConfirmed, sendMailSubscriptionCanceled};
