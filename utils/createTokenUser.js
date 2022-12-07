/** @format */

const createTokenUser = (user) => {
  return { username: user.username, userId: user._id, role: user.role,custodyId:user.custodyId};
};

module.exports = createTokenUser;
