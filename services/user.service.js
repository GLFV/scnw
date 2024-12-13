const { findUser, getAllUsers } = require('../repository/user.repository.js');

const findUserById = async (id) => {
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return { error: 'Invalid user ID' };
  }

  const user = await findUser({ id: numericId }, 'OR');

  if (!user) {
    return { error: 'User not found' };
  }

  return user;
};

const getUsers = async () => {
  try {
    const users = await getAllUsers();
    return users;
  } catch (error) {
    return { error: 'Error fetching users' };
  }
};

module.exports = { findUserById, getUsers };
