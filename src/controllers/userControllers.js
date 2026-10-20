const {  submitARating, claimABusiness } = require('../services/user.services');

const submitRatingController = async (req, res) => {
  try{
    const { rating, comment, ...rest_of_body } = req.body;
    const user= await submitARating({ review: { rating, comment }, ...rest_of_body });
    res.status(200).json({ success: true, message:'rating submitted successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    res.status(400).json({ success: false, message: error.message });
  }
};
const claimBusinessController = async (req, res) => {
  try{
    const {businessId, proof}= req.body;
    const {_id: userId} = req.user;
    const user= await claimABusiness({ businessId, userId, proof });
    res.status(200).json({ success: true, message:'business claimed successfully', data: { user } });
  }
   catch (error) {
console.log({error})
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { submitRatingController, claimBusinessController };