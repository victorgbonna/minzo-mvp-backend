const { registerAdmin, loginAdmin, getAnAdmin, getCurrentAdmin, approveARating, approveABusiness, getAuditLogs, bulkAddBusinesses, getPendingRatings, getPendingBusinesses } = require('../services/admin.services');

// registerAdminController, loginAdminController, getAnAdminController, getCurrentAdminController, approveRatingController, approveABusinessController
const registerAdminController = async (req, res, next) => {
  try{
    const user= await registerAdmin(req.body);
    res.status(200).json({ success: true, message:'admin registered successfully', data: { user } });
  }
   catch (error) {
    next(error);
  }
};
const loginAdminController = async (req, res, next) => {
  try{
    const user= await loginAdmin(req.body);
    res.status(200).json({ success: true, message:'admin logged in successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const getAnAdminController = async (req, res, next) => {
  try{
    const user= await getAnAdmin({ adminId: req.params.adminId });
    res.status(200).json({ success: true, message:'admin fetched successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const getCurrentAdminController = async (req, res, next) => {
  try{
    const user= await getCurrentAdmin(req);
    res.status(200).json({ success: true, message:'current admin fetched successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const approveRatingController = async (req, res, next) => {
  try{
    const user= await approveARating({ ...req.body, admin: req.user._id });
    res.status(200).json({ success: true, message:'rating approval updated successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const approveABusinessController = async (req, res, next) => {
  try{
    const user= await approveABusiness({ ...req.body, admin: req.user._id });
    res.status(200).json({ success: true, message:'business approval updated successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const approveARatingController = async (req, res, next) => {
  try{
    const user= await approveARating({ ...req.body, admin: req.user._id });
    res.status(200).json({ success: true, message:'rating approval updated successfully', data: { user } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};
const getAuditLogsController = async (req, res, next) => {
  try{
    const logs= await getAuditLogs({ admin: req.user._id });
    res.status(200).json({ success: true, message:'audit logs fetched successfully', data: { logs } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};
const bulkAddBusinessesController = async (req, res, next) => { 
  try{
    const result= await bulkAddBusinesses({ businesses:req.body.businessdata, admin: req.user._id });
    res.status(200).json({ success: true, message:'businesses added successfully', data: { result } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const getPendingRatingsController = async (req, res, next) => {
  try{
    const ratings= await getPendingRatings();
    res.status(200).json({ success: true, message:'pending ratings fetched successfully', data: { ratings } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

const getPendingBusinessesController = async (req, res, next) => {
  try{
    const businesses= await getPendingBusinesses();
    res.status(200).json({ success: true, message:'pending businesses fetched successfully', data: { businesses } });
  }
   catch (error) {
    console.log({error})
    next(error);
  }
};

module.exports = { registerAdminController, loginAdminController, getAnAdminController, getCurrentAdminController, approveRatingController, approveABusinessController, approveARatingController, getAuditLogsController, bulkAddBusinessesController, getPendingRatingsController, getPendingBusinessesController };