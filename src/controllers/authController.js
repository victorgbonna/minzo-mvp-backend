const { registerUser, loginUser, getAUser, getCurrentUser, registerBusinessAndUser } = require('../services/auth.services');

const registerUserController = async (req, res, next) => {
  try{
    if(!req.body.phone && !req.body.email){
      return res.status(400).json({ success: false, message: 'phone and email are required' });
    }
    const user= await registerUser(req.body);
    res.status(200).json({ success: true, message:'user registered successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json({ success: true, message: 'user logged in successfully', data: { user } });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const getAUserController = async (req, res, next) => {
  try {
    const user = await getAUser(req.params.id);
    res.status(200).json({ success: true, message: 'user retrieved successfully', data: { user } });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
const getCurrentUserController = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req);
    res.status(200).json({ success: true, message: 'current user retrieved successfully', data: { user } });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const registerBusinessAndUserController = async (req, res, next) => {
  try {
    const { email, phone, name, password, ...businessData } = req.body;
    const userData = { email, phone, name, password };
    const result = await registerBusinessAndUser({ businessData, userData });
    res.status(200).json({ success: true, message: 'business and user registered successfully', data: result });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
module.exports = { registerUserController, loginUserController, getAUserController, getCurrentUserController, registerBusinessAndUserController };