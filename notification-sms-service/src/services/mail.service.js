const Mailjet = require("node-mailjet");
const crypto = require('crypto'); // Module pour générer des tokens sécurisés

// Create a new mailjet client instance
// const client = mailjet.connect(
//   "3b07147d5961495f0bc339942698d4ed",
//   "7c91bb019d7be6296dc510c5fa9d91e3"
// );
async function sendMail(
  from,
  to,
  subject,
  text,
  duration,
  price,
  nameSubscription
) {
  const mailjet = new Mailjet({
    apiKey: "3b07147d5961495f0bc339942698d4ed",
    apiSecret: "7c91bb019d7be6296dc510c5fa9d91e3",
  });
  const messageData = {
    Messages: [
      {
        From: from,
        To: to,
        Subject: subject,
        // TextPart: text,
        HTMLPart: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de Souscription</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Confirmation de Souscription</h2>
            <p>Merci ${
              to[0].Name
            } de vous être abonné à notre service. Vous trouverez ci-dessous les détails de votre abonnement :</p>
            <ul>
              <li><strong>Nom de l'abonnement:</strong> ${
                nameSubscription ?? "premium"
              }</li>
              <li><strong>Durée:</strong> ${duration ?? "1 mois"}</li>
              <li><strong>Prix:</strong> ${price ?? "30€"}</li>
            </ul>
            <p>Votre abonnement est désormais actif et prêt à être utilisé.</p>
            <p>Merci encore pour votre confiance. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter.</p>
            <p>Cordialement,<br>La faille d'invocateur</p>
          </div>
        </body>
        </html>
        `,

      },
    ],
  };
  try {
    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({ Messages: messageData.Messages });
    console.log(result.response);

    const body = result.body;
    console.log(body.Messages[0]);

    console.log("Mail sent successfully:", result.body);
    return result.body;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
}

async function sendResetMail(from, to, subject, text) {
  const mailjet = new Mailjet({
    apiKey: "3b07147d5961495f0bc339942698d4ed",
    apiSecret: "7c91bb019d7be6296dc510c5fa9d91e3",
  });
  const messageData = {
    Messages: [
      {
        From: from,
        To: to,
        Subject: subject,
        // TextPart: text,
        HTMLPart: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de Souscription</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">${subject}</h2>
            <p>${text}</p>
            <p>Cordialement,<br>La faille d'invocateur</p>
          </div>
        </body>
        </html>
        `,
        // Attachments: attachments.map((attachment) => ({
        //   ContentType: attachment.ContentType,
        //   Filename: attachment.Filename,
        //   Base64Content: attachment.Base64Content,
        // })),
      },
    ],
  };
  try {
    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({ Messages: messageData.Messages });

    const body = result.body;
    console.log(body.Messages[0]);

    console.log("Mail sent successfully:", result.body);
    return result.body;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
}

async function envoyerEmailResetMotDePasse(emailDestinataire, lienResetMotDePasse, token) {
  const mailjet = new Mailjet({
    apiKey: "3b07147d5961495f0bc339942698d4ed",
    apiSecret: "7c91bb019d7be6296dc510c5fa9d91e3",
  });


  const messageData = {
    Messages: [{
      From: {
          Email: "lionelkomguemalma@gmail.com",
          Name: "lionel"
      },
      To: [{
          Email: emailDestinataire
      }],
      Subject: "Réinitialisation de mot de passe",
      TextPart: "Bonjour, veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : " + lienResetMotDePasse + "?token=" + token,
      HTMLPart: "<h3>Bonjour,</h3><p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : <a href='" + lienResetMotDePasse + "?token=" + token + "'>Réinitialiser mot de passe</a></p>",
    }]
    
  };
      const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({ Messages: messageData.Messages });
    console.log(result.response);
}

function genererToken() {
  return crypto.randomBytes(20).toString('hex');
}

module.exports = { sendMail, sendResetMail , envoyerEmailResetMotDePasse, genererToken};
