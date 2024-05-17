// Importer le module Twilio
const twilio = require("twilio");

// Initialiser le client Twilio avec votre SID de compte et votre token d'authentification
const client = twilio(
  "ACafb5f8985192807981dbbdba97f7b9a5",
  "e9de49d2c24224db2a002e20a767a935"
);

// Fonction pour envoyer un SMS
async function sendSMS(to, message) {
  try {
    // Utiliser le client Twilio pour envoyer le message
    const result = await client.messages.create({
      body: message,
      from: "+12513068098",
      to: to,
    });
    console.log("Message sent successfully. SID:", result.sid);
    return result.sid; // Retourner l'identifiant du message (SID) pour référence
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

module.exports = { sendSMS };
