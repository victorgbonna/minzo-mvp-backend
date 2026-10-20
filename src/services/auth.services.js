const bcrypt = require("bcryptjs");
const config = require('../config/constants');
const User = require('../model/User');
const Business = require('../model/Business');
const jwt = require("jsonwebtoken");



const JWT_SECRET = config.APP_SECRET_KEY;


const getAUser = async ({prop, val, val2, includePassword=false}) => {
  const query = Array.isArray(prop) ? { $or: prop.map(p => ({ [p]: p === "email" ? val : val2 })) } : { [prop]: val };
  const fetchUser= includePassword ? await User.findOne(query).select('+password').lean() : await User.findOne(query).lean();
  return fetchUser;
};
const registerUser = async (userData) => {
  const existingUser = await getAUser({ prop: ["email",'phone'], val: userData.email, val2:userData.phone });
  if(existingUser) {
    if(existingUser.email === userData.email) {
      throw new Error("User with this email already exists");
    }
    if(existingUser.phone === userData.phone) {
      throw new Error("User with this phone number already exists");
    }
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({
    ...userData,
    password: hashedPassword,
  });
  await user.save();
  return {
    _id: user._id,
    email: user.email,
    phone: user.phone
  };
};
const loginUser = async (userData) => {
  const existingUser = await getAUser({ prop: ["email",'phone'], val: userData.identifier, val2: userData.identifier, includePassword:true });
  if(!existingUser) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);
  if(!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: "40d" });
  return { user: {_id:existingUser._id}, token };
};
const getCurrentUser = (req) => {
  if (!req.user) {
    throw new Error("Authentication required");
  }

  return req.user;
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
const registerBusinessAndUser = async ({businessData, userData}) => {
    const user = await registerUser(userData);
    const city = liberiaCities.find(
        (item) =>
          item.city.toLowerCase() === businessData.city?.trim().toLowerCase()
      );
    const location = city ? {
            type: "Point",
            coordinates: [
              Number(city?.longitude) ?? null,
              Number(city?.lat) ?? null,
            ],
          } : null;
    const findBusinessByName = await Business.findOne({ businessName: businessData.businessName });
    if(findBusinessByName) {
        throw new Error("Business with this name already exists");
    }
    const business = new Business({
        ...businessData,
        owner: user._id,
        location
    });
    await business.save();
    return { user:userData, business };
}

module.exports = { getAUser, registerUser, loginUser, getCurrentUser, registerBusinessAndUser };