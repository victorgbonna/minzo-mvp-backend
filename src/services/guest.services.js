
const Business = require('../model/Business');
const Rating = require('../model/Rating');
// GET /api/v1/businesses/top-rated · GET /api/v1/businesses/nearby
// GET /api/v1/businesses
// /api/v1/businesses/:businessId/reviews
// GET /api/v1/businesses/:businessId


const getABusiness = async (businessId) => {
  const fetchBusiness = await Business.findById(businessId).populate('owner','name').lean();;
  return fetchBusiness;
};

const getFewBusinesses = async ({extra}) => {
  console.log({extra})
  return await 
  Business.find({})
  .sort(extra ? { [extra]: -1 } : {})
  .limit(10);
};
 function toRad(degrees) {
   return (degrees * Math.PI) / 180;
 }

 function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );
  }
const getNearbyBusinesses = async (query) => {
   const { latitude, longitude } =query;
   console.log({latitude, longitude})
    const businesses = await Business.find({
      // approvalStatus: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
        },
      },
    }).sort({createdAt:-1}).limit(6);
    return businesses;
};

const getAllBusinesses = async (query) => {
   let { limit=10, page, keyword, type, nearby} = query;
        page = page || 1;
        const skip = page ? (page - 1) * limit : 0;
        
        const condi={
            ...(!keyword? {}:
            {
                $or: [
                    {businessName: { $regex: keyword, $options: "i" } },
                    {type: { $regex: keyword, $options: "i" } },
                    // { email: { $regex: q, $options: "i" } },
                ]
            }),
            ...(!type? {}:{type}),
            ...(nearby ? {} : {
              location: {
                $near: {
                  $geometry: {
                    type: "Point",
                    coordinates: [Number(longitude), Number(latitude)],
                  },
                },
              },
            })
        }
        const count = await Business.find(condi).countDocuments();
    
        let pages = 0;
        if (count > 0) {
          if (limit) {
            pages = Math.ceil(count / limit);
          } else {
            pages = 1;
          }
        }
    
        const result = {};
        limit = limit - 0;
    
        if (page * 1 < pages) {
          result.next = { limit, page: page * 1 + 1 };
        }
        if (page * 1 <= pages && page - 1 != 0) {
          result.previous = { limit, page: page - 1 };
        }
    
        const businesses = await Business.find(condi)
          .sort({ createdAt: -1 })
          .limit(limit * 1)
          .skip(skip);
        return {
          status: "success",
            meta: {
              ...result,
              count,
              pages
            },
            businesses
          }     
}

const getAllRatingsOfABusiness = async (businessId) => {
  const reviews = await Rating.find({ business: businessId }).sort({createdAt:-1}).lean();
  return reviews;
};

module.exports = { getABusiness, getFewBusinesses, getNearbyBusinesses, getAllBusinesses, getAllRatingsOfABusiness };
