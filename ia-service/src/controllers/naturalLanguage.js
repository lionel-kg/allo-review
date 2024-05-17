const language = require('@google-cloud/language');

async function analyzeSentiment(content) {
  const client = new language.LanguageServiceClient();

  try {
    const document = {
      content,
      type: 'PLAIN_TEXT',
    };

    const analyse = await client.analyzeSentiment({document});

    return analyse[0].documentSentiment;
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  }
}

const fetchNaturalLanguage = async (req, res) => {
  try {
    const sentiment = await analyzeSentiment(req.body.content);

    res.json(sentiment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default {fetchNaturalLanguage};
