
const Rating = require('../model/Rating');
const Business = require('../model/Business');
const Admin = require('../model/Admin');
const AuditLogs = require('../model/AuditLogs');
const bcrypt = require("bcryptjs");
const config = require('../config/constants');
const User = require('../model/User');
const jwt = require("jsonwebtoken");



const JWT_SECRET = config.APP_SECRET_KEY;

const getPendingRatings = async () => {
  return await Rating.find({ approvalStatus: 'pending' }).sort({createdAt:-1}).populate('user', 'name').populate('business', 'businessName type').lean();
};
const createAnAuditLog= async (details) => {
    try{    
        await AuditLogs.create(details);
    }
    catch(e){
        console.log(e)
    }
};

const getAnAdmin = async ({prop, val, val2, includePassword=false}) => {
  const query = Array.isArray(prop) ? { $or: prop.map(p => ({ [p]: p === "email" ? val : val2 })) } : { [prop]: val };
  const fetchUser= includePassword ? await Admin.findOne(query).select('+password').lean() : await Admin.findOne(query).lean();
  
  return fetchUser;
};
const registerAdmin = async (userData) => {
  const existingAdmin = await getAnAdmin({ prop: ["email",'phone'], val: userData.email || userData.phone, includePassword:true });
  if(existingAdmin) {
    if(existingAdmin.email === userData.email) {
      throw new Error("Admin with this email already exists");
    }
    if(existingAdmin.phone === userData.phone) {
      throw new Error("Admin with this phone number already exists");
    }
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const admin = new Admin({
    ...userData,
    password: hashedPassword,
  });
  await admin.save();
  return userData;
};
const loginAdmin = async (userData) => {
  const existingAdmin = await getAnAdmin({ prop: ["email",'phone'], val: userData.identifier, includePassword:true });
  if(!existingAdmin) {
    throw new Error("Admin not found");
  }
  const isPasswordValid = await bcrypt.compare(userData.password, existingAdmin.password);
  if(!isPasswordValid) {
    throw new Error("Invalid password");
  }
  console.log({ _id: existingAdmin._id, token:JWT_SECRET, config: config.APP_SECRET_KEY })
  const token = jwt.sign({ id: existingAdmin._id }, JWT_SECRET, { expiresIn: "40d" });
  createAnAuditLog({ action: 'login ', targetType:'Admin', targetId: existingAdmin._id, admin: existingAdmin._id });
  return { admin: {_id:existingAdmin._id}, token };
};
const getCurrentAdmin = (req) => {
  if (!req.user) {
    throw new Error("Authentication required");
  }

  return req.user;
};
const approveARating = async ({businessId, userId, approvalStatus, admin}) => {
  
  const rating= await Rating.findOne({business: businessId, user: userId});
  if(!rating){
        throw new Error('Rating not found');
    }
  if(approvalStatus === 'rejected'){
    await Rating.updateOne({business: businessId, user: userId}, {approvalStatus: 'rejected'});
    return rating;
  }
  const get_the_business=await Business.findById(businessId).lean();
  if(!get_the_business){
        throw new Error('Business not found');
    }
  const {ratings}= get_the_business;
  const currentTotalRating = !ratings.length ? 0 : ratings.reduce((total, r) => total + r.value, 0);
  const currentRatingCount = ratings.length;
  const newTotalRating = currentTotalRating + rating.rating;
  const newRatingCount = currentRatingCount + 1;
  const newAverageRating = newTotalRating===0 ? 0 : newTotalRating / newRatingCount;
  //what of for race conditions?? tackled
  await Business.updateOne({ _id: businessId }, { $set: { averageRating: newAverageRating }, $push: { ratings: { ratingId: rating._id, value: rating.rating } } });
  await Rating.updateOne({business: businessId, user: userId}, {approvalStatus: 'approved'});
  createAnAuditLog({ action: approvalStatus === 'approved' ? 'approve rating' : 'reject rating', targetType:'Rating', targetId: rating._id, admin: admin });
  return rating;
};

const approveABusiness = async ({businessId, approvalStatus, admin}) => {
//   const get_the_business=await Business.findById(businessId).lean();
//   if(!get_the_business){
//         throw new Error('Business not found');
//     }
  await Business.updateOne({ _id: businessId }, 
    { 
        approvalStatus: approvalStatus,
        ...(approvalStatus==='approved' ? { badgeStatus: 'verified' } : {})
    });
  createAnAuditLog({ action: approvalStatus === 'approved' ? 'approve business' : 'reject business', targetType:'Business', targetId: businessId, admin });
  return { businessId, approvalStatus };
};

const getAuditLogs = async () => {
//   const get_the_business=await Business.findById(businessId).lean();
//   if(!get_the_business){
//         throw new Error('Business not found');
//     }
  const audit_logs= await AuditLogs.find({})
    .populate('admin', 'name email')
    .populate('targetId', 'name businessName type email businessEmail phone businessPhone rating comment')
    .sort({createdAt:-1})
    .lean();
  return audit_logs;
};
const liberiaCities = [
  { city: "Monrovia", county: "Montserrado", lat: 6.30054, longitude: -10.7969 },
  { city: "Paynesville", county: "Montserrado", lat: 6.2750, longitude: -10.7092 },
  { city: "Gbarnga", county: "Bong", lat: 6.99543, longitude: -9.47122 },
  { city: "Buchanan", county: "Grand Bassa", lat: 5.87693, longitude: -10.04964 },
  { city: "Ganta", county: "Nimba", lat: 7.235, longitude: -8.98444 },
  { city: "Kakata", county: "Margibi", lat: 6.53104, longitude: -10.35368 },
  { city: "Zwedru", county: "Grand Gedeh", lat: 6.06846, longitude: -8.13559 },
  { city: "Harbel", county: "Margibi", lat: 6.24683, longitude: -10.35642 },
  { city: "Harper", county: "Maryland", lat: 4.3782, longitude: -7.71081 },
  { city: "Pleebo", county: "Maryland", lat: 4.58953, longitude: -7.67218 },
  { city: "Foya", county: "Lofa", lat: 8.36028, longitude: -10.20639 },
  { city: "Voinjama", county: "Lofa", lat: 8.42194, longitude: -9.74778 },
  { city: "Tubmanburg", county: "Bomi", lat: 6.87064, longitude: -10.8211 },
  { city: "Greenville", county: "Sinoe", lat: 5.01133, longitude: -9.0388 },
  { city: "Robertsport", county: "Grand Cape Mount", lat: 6.7533, longitude: -11.3671 },
  { city: "Bomi Hills", county: "Bomi", lat: 6.7560, longitude: -10.8430 },
  { city: "Bensonville", county: "Montserrado", lat: 6.4475, longitude: -10.6125 },
{ city: "Bopolu", county: "Gbarpolu", lat: 7.0667, longitude: -10.4875 },
{ city: "Barclayville", county: "Grand Kru", lat: 4.6744, longitude: -8.2339 },
{ city: "Sanniquellie", county: "Nimba", lat: 7.3622, longitude: -8.7133 },
{ city: "River Cess", county: "Rivercess", lat: 5.4667, longitude: -9.5833 },
{ city: "Fish Town", county: "River Gee", lat: 5.1974, longitude: -7.8758 }
];
const bulkAddBusinesses = async ({ businesses, admin }) => {
  // const result = [];
  if(!businesses || !businesses.length){
    throw new Error('No businesses to add');
  }
    const businessesWithLocation = businesses.map((business) => {
      const city = liberiaCities.find(
        (item) =>
          item.city.toLowerCase() === business.city?.trim().toLowerCase()
      );
      console.log({ city, item: business.city});
      const location = city ? {
        type: "Point",
        coordinates: [
          Number(city?.longitude) ?? null,
          Number(city?.lat) ?? null,
        ],
      } : null;
      return {
        ...business,
         location,
      };
    });

const result = await Business.insertMany(businessesWithLocation);
  createAnAuditLog({ action: 'bulk add businesses', targetType: 'Business', targetId: null, admin });
  return {status:'success', resultCount:result?.length, expectedResultCount:businesses?.length};
};
const getPendingBusinesses = async () => {
  const businesses = await Business.find({ approvalStatus: 'pending' })
    .populate('owner', 'name email phone')
    .sort({updatedAt:-1});
  return businesses;
};

module.exports = { getAnAdmin, getPendingRatings, registerAdmin, loginAdmin, getCurrentAdmin, approveARating, approveABusiness, getAuditLogs, bulkAddBusinesses, getPendingBusinesses };