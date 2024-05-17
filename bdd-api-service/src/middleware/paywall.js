// const redis = require('../config/redis');
const prisma = require('../config/db.js');

const paywall = async (req, res, next) => {
  const userEmail = req.userToken.email;

  // const key = `user:${userId}:views`;

  try {  
     let {viewCount, id} = await prisma.user.findUnique({
      where: {email: userEmail},
      select: {viewCount: true , id: true},
    });

    const subscription = await prisma.subscription.findUnique({
      where: {userId: parseInt(id)},
    });

    if (subscription) {
      return next();
    }

    console.log(viewCount)
    // let views = (await redis.get(key)) || 0;

 

    if (viewCount >= 10) {
      return res
        .status(403)
        .json({message: 'Limite atteinte, abonnement nécessaire'});
    }

    viewCount++;
    // await redis.set(key, views);
    // await redis.expire(key, 30 * 24 * 60 * 60); //Expire en 30 jours

    await prisma.user.update({
      where: {id: id},
      data: {viewCount},
    });

    next();
  } catch (error) {
    console.error('Error checking user view limit:', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
};

module.exports = paywall;
