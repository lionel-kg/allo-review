import {GoogleGenerativeAI, SchemaType} from '@google/generative-ai';
import {apiTmdb} from '../config/axios';

const generatePrompt = (genres, platforms, userReviews, userLikes) => {
  let basePrompt = 'Recommande 10 films.';

  // Ajouter les reviews s'il y en a
  if (userReviews?.length > 0) {
    basePrompt += `\nBasés sur les avis suivants:\n`;
    basePrompt += userReviews
      .map(
        (review, index) =>
          `${index + 1}. ${review.movie.title} : "${review.content}"`,
      )
      .join('\n');
  }

  // Ajouter les likes s'il y en a
  if (userLikes?.length > 0) {
    basePrompt += `\nBasé sur les films likés suivants:\n`;
    basePrompt += userLikes
      .map((like, index) => `${index + 1}. ${like.title}`)
      .join('\n');
  }

  // Si ni reviews ni likes
  if (!userReviews?.length && !userLikes?.length) {
    basePrompt += '\nBasés sur les films populaires et bien notés.';
  }

  // Ajouter les genres
  if (genres?.length > 0) {
    basePrompt += `\nLimite tes recommandations aux films de genre: ${genres.join(', ')}.`;
  }

  // Ajouter les plateformes
  if (platforms?.length > 0) {
    basePrompt += `\nLimite tes recommandations aux films disponibles sur: ${platforms.join(', ')}.`;
  }

  basePrompt += '\nUniquement les films, et non les séries.';

  return basePrompt;
};

const schema = {
  description: 'List of movies',
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      title: {
        type: SchemaType.STRING,
        description: 'Movie title',
        nullable: false,
      },
      why: {
        type: SchemaType.STRING,
        description: 'Reason why the movie was recommended',
        nullable: false,
      },
    },
    required: ['title'],
  },
};

const genAI = new GoogleGenerativeAI(process.env.API_GOOGLE);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  },
});

const generate = async (genres, platforms, userReviews, userLikes) => {
  try {
    const prompt = generatePrompt(genres, platforms, userReviews, userLikes);
    console.log(prompt);
    const result = await model.generateContent(prompt);

    const text = JSON.parse(result.response.text());

    return text;
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations :', error);
  }
};

const checkAvailabilityOnTMDb = async (movieId, platforms) => {
  try {
    // Requête pour obtenir les fournisseurs (plateformes de streaming)
    const providersResponse = await apiTmdb.request(
      `movie/${movieId}/watch/providers`,
    );
    const providers = providersResponse.data.results.FR?.flatrate;

    const adaptedPlatforms = platforms.map(platform => {
      switch (platform) {
        case 'Disney+':
          return 'Disney Plus';
        case 'Prime Video':
          return 'Amazon Prime Video';
        case 'Apple TV+':
          return 'Apple TV Plus';
        default:
          return platform;
      }
    });

    const availableOnPlatforms = providers?.filter(provider =>
      adaptedPlatforms.includes(provider.provider_name),
    );

    return availableOnPlatforms?.length > 0;
  } catch (error) {
    console.error(
      'Erreur lors de la vérification des plateformes sur TMDb :',
      error,
    );
    return false;
  }
};

module.exports = {
  generate,
  checkAvailabilityOnTMDb,
};
