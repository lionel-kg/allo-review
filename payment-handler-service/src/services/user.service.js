const axios = require('axios');

async function updateUser(user, idStripe) {
  try {
    const response = await axios.put(
      `${process.env.BDD_API_URL}/user/${user.id}`,
      {
        idStripe: idStripe,
      },
    );

    console.log('User updated:', response.data);
  } catch (error) {
    console.error('Failed to update subscription:', error);
  }
}

async function getUser(email) {
  try {
    const response = await axios.post(
      `${process.env.BDD_API_URL}/user/exists`,
      {
        email: email,
      },
    );
    return response.data;
  } catch (error) {
    // console.error('Failed to fetch user:', error);
  }
}

async function getUserSubscription(userId) {
  try {
    const response = await axios.get(
      `${process.env.BDD_API_URL}/user/${userId}/subscription`,
    );
    console.log('Subscription retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
  }
}

module.exports = {updateUser, getUser, getUserSubscription};
