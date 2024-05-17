const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const appreciations = [
    {
      // Rating : 9/10
      title: "High Praise",
      min_score: 0.5,
      max_score: 1.0,
      min_magnitude: 0,
      max_magnitude: 100,
      description:
        "Intense and repeated praise, often for works considered masterpieces or revolutionary in their genre. This covers all high scores regardless of magnitude, capturing all strongly positive sentiments.",
    },
    {
      // Rating : 7/10
      title: "Positive Feedback",
      min_score: 0.1,
      max_score: 0.5,
      min_magnitude: 5,
      max_magnitude: 20,
      description:
        "Positive reviews appreciating specific aspects like acting or direction, generally favorable and moderately enthusiastic.",
    },
    {
      // Rating : 6/10
      title: "Moderate Appreciation",
      min_score: 0.1,
      max_score: 0.5,
      min_magnitude: 0,
      max_magnitude: 5,
      description:
        "Reserved but positive critiques indicating modest pleasure or interest in the film or series. Suitable for mild positive reactions without strong emotional depth.",
    },
    {
      // Rating : 5/10
      title: "Controversial Opinions",
      min_score: -0.2,
      max_score: 0.2,
      min_magnitude: 0,
      max_magnitude: 10,
      description:
        "Reviews expressing deep ambivalence in low-magnitude scenarios, where appreciation of certain elements is tempered by criticisms of others.",
    },
    {
      // Rating : 5/10
      title: "Mixed Reactions",
      min_score: -0.2,
      max_score: 0.2,
      min_magnitude: 10,
      max_magnitude: 100,
      description:
        "Mixed opinions that recognize both strengths and weaknesses of a film or series, applicable for all high-magnitude neutral sentiments.",
    },
    {
      // Rating : 4/10
      title: "Mild Criticisms",
      min_score: -0.3,
      max_score: -0.1,
      min_magnitude: 0,
      max_magnitude: 15,
      description:
        "Slight disagreements or critiques regarding certain aspects, generally mild and not overly harsh.",
    },
    {
      // Rating : 3/10
      title: "Negative Critiques",
      min_score: -0.5,
      max_score: -0.3,
      min_magnitude: 0,
      max_magnitude: 15,
      description:
        "Negative feedback highlighting noticeable flaws without being overly harsh or intense.",
    },
    {
      // Rating : 2/10
      title: "Strong Disapproval",
      min_score: -1.0,
      max_score: -0.5,
      min_magnitude: 0,
      max_magnitude: 100,
      description:
        "Strongly negative reviews expressing major dissatisfaction, typically towards highly anticipated films or series that failed to meet expectations.",
    },
  ];

  console.log(`Seeding ${appreciations.length} appreciations...`);
  await prisma.review.deleteMany({});
  await prisma.movie.deleteMany({});

  await prisma.appreciation.deleteMany({});

  for (let appreciation of appreciations) {
    try {
      await prisma.appreciation.create({ data: appreciation });
    } catch (innerMovieError) {
      console.error(
        `Error processing appreciation ${appreciation.id}: ${innerMovieError.message}`
      );
    }
  }
  console.log(`Seeded ${appreciations.length} appreciations successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
