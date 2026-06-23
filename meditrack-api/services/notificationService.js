const Notification = require("../models/Notification");

const createIfNotExists = async ({ user, title, message, type }) => {
  const existing = await Notification.findOne({ user, title, message, read: false });
  if (existing) return null;
  return await Notification.create({ user, title, message, type });
};

module.exports = { createIfNotExists };
