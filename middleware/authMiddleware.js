const basicAuth = require('express-basic-auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authenticateUser = async (mobileNo, password) => {
  try 
  {
    // Find the user by mobileNumber
    const user = await User.findOne({ mobileNumber: mobileNo });

    if (!user) 
    {
      return false; // User not found
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch)
    {
      return false;
    }

    return user.mobileNumber;
  } 
  catch (error) 
  {
    console.error(error);
    return false;
  }
};

const authMiddleware = basicAuth({
  authorizer: authenticateUser,
  challenge: true, // Sends a 401 Unauthorized response when authentication fails
  unauthorizedResponse: 'Unauthorized access', // Response message for unauthorized access
});

module.exports = authMiddleware;
