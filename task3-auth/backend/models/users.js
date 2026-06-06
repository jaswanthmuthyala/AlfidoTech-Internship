/**
 * users.js — simple in-memory "database"
 *
 * In a real project, replace this with Mongoose / Prisma / Sequelize.
 * The shape stays the same: { id, email, passwordHash, role, createdAt }
 */

let users = [];
let nextId = 1;

module.exports = {
  findByEmail: (email) =>
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()),

  findById: (id) => users.find((u) => u.id === id),

  create: ({ email, passwordHash, role = "user" }) => {
    const user = {
      id: nextId++,
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },

  // Return safe user object (never expose passwordHash to client)
  toPublic: ({ id, email, role, createdAt }) => ({
    id,
    email,
    role,
    createdAt,
  }),
};
