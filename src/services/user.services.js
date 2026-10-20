const Rating = require('../model/Rating');
const Business = require('../model/Business');

const submitARating = async ({businessId, userId, review}) => {
  const check_rating_exists=await Rating.findOne({business: businessId, user: userId}).lean();
  if(check_rating_exists){
        throw new Error('You have already rated this business');
    }
  const rating= new Rating({business: businessId, user: userId, ...review});
  
  await rating.save();
//   const {totalRating: currentTotalRating, ratingCount: currentRatingCount}= get_the_business;
//   const newTotalRating = currentTotalRating + review.rating;
//   const newRatingCount = currentRatingCount + 1;
//   const newAverageRating = newTotalRating / newRatingCount;
//   await Business.updateOne({ _id: businessId }, { $inc: { totalRating: review.rating, ratingCount: 1 }, $set: { averageRating: newAverageRating } });
  return rating;
};

const claimABusiness = async ({businessId, userId, proof}) => {
  const findBusinessById = await Business.findById(businessId).lean();
  if(!findBusinessById) {
      throw new Error("Business not found");
  }
  console.log({owner: findBusinessById?.owner, userId})
  if(findBusinessById?.owner?.toString() == userId?.toString()) {
    throw new Error("You have already claimed this business, kindly wait for approval");
  }
  if(findBusinessById?.owner) {
    throw new Error("Business already has an owner");
  }

  await Business.updateOne({ _id: businessId }, 
    { 
        owner:userId,
        ...proof
    });
  return { businessId, owner: userId };
};
module.exports = { submitARating, claimABusiness };     