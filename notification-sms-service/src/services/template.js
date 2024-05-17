const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de Souscription</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333;">Confirmation de Souscription</h2>
    <p>Merci de vous être abonné à notre service. Vous trouverez ci-dessous les détails de votre abonnement :</p>
    <ul>
      <li><strong>Nom de l'abonnement:</strong> [Nom de l'abonnement]</li>
      <li><strong>Durée:</strong> [Durée de l'abonnement]</li>
      <li><strong>Prix:</strong> [Prix de l'abonnement]</li>
    </ul>
    <p>Votre abonnement est désormais actif et prêt à être utilisé.</p>
    <p>Merci encore pour votre confiance. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter.</p>
    <p>Cordialement,<br>[Votre Entreprise]</p>
  </div>
</body>
</html>
`;

module.exports = templateHtml;
