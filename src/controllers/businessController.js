const {  getFewBusinesses, getABusiness, getAllRatingsOfABusiness, getAllBusinesses, getNearbyBusinesses } =require('../services/guest.services');

const getAllBusinessesController = async (req, res, next) => {
  try{
    const user= await getAllBusinesses(req.query); 
    res.status(200).json({ success: true, message:'businesses fetched successfully', data: { user } });
  }
   catch (error) {
next(error);
  }
};
const getNearbyBusinessesController = async (req, res, next) => {
   try{
    const businesses= await getNearbyBusinesses(req.query);
    res.status(200).json({ success: true, message:'nearby businesses fetched successfully', data: { businesses } });
  }
   catch (error) {
next(error);
  }
};
const getTopRatedBusinessesController = async (req, res, next) => {
  try{
    const businesses= await getFewBusinesses({extra: 'averageRating'});
    res.status(200).json({ success: true, message:'top rated businesses fetched successfully', data: { businesses } });
  }
   catch (error) {
    next(error);
  }
};
const getABusinessController = async (req, res, next) => {
  try{
    const business= await getABusiness(req.params.id);
    res.status(200).json({ success: true, message:'business fetched successfully', data: { business } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const getBusinessRatings= async (req, res, next) => { 
  try{          
    const ratings= await getAllRatingsOfABusiness(req.params.id);
    res.status(200).json({ success: true, message:'business ratings fetched successfully', data: { ratings } });
  }
   catch (error) {
    next(error);
  }
};


module.exports = { getAllBusinessesController, getNearbyBusinessesController, getTopRatedBusinessesController, getABusinessController, getBusinessRatings        };