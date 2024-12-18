const { Prisma, PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findUser = async (searchParams, operator) => {
  const conditions = Object.entries(searchParams).map(([key, value]) => ({
    [key]: value,
  }));

  const user = await prisma.user.findFirst({
    where: {
      [operator]: conditions,
    },
  });

  return user;
};

const userCreate = async (user) => {
  const result = await prisma.user.create({
    data: {
      ...user,
    },
  });

  return result;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

module.exports = { findUser, userCreate, getAllUsers };
