const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    // Get the token from the authorization header
    const token = request.headers.authorization.split(" ")[1];
    console.log(token)
    // Check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, process.env.JWTCODE);
    console.log(decodedToken.userId);
    
    // Retrieve the user details of the logged-in user (which is in the decodedToken)
    request.user = decodedToken;

    // Pass down functionality to the endpoint
    next();
    
  } catch (error) {
    response.status(401).json({
      error: "Invalid request!"
    });
  }
};
