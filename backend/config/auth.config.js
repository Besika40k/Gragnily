module.exports = {
  secret: process.env.JWT_SECRET_KEY,
  jwtExpiration: 20,
  jwtRefreshExpiration: 86400,
};
