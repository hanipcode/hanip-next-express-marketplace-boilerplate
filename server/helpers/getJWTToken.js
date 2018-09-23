module.exports = function getJWTToken(tokenWithBearer: string) {
  return tokenWithBearer.split(' ')[1];
};
