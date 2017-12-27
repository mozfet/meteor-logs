/*jshint esversion: 6 */

const isAdmin = (userId) => {
  const id = userId?userId:Meteor.userId();
  return Roles.userIsInRole(id, ['admin']);
};

/**
 * Determine ownership of a document
 * @param {string} userId - the owners who's ownership is being validated
 * @param {object} doc - the document being validated
 */
const isOwner = (userId, doc) => {
  const id = userId?userId:Meteor.userId();
  return doc && (doc.ownerId === id);
};

/**
 * Determine if a userId is valid or if it is available
 * @param {string} userId - the id of the user
 * @return {boolean} true of user exists
 */
const isUser = (userId) => {
  const id = userId?userId:Meteor.userId();
  const user = Meteor.users.findOne(id, {fields: {}});
  return user?true:false;
};

/**
 * Get an human friendly label for a user.
 * Preferably username or email.
 * @param {string} userId - the id of the user
 */
const userLabel = (userId) => {
  const user = Meteor.users.findOne(userId);
  console.log('######user', user);
  const emails = _.map(user.emails, (email) => {
    return email.address;
  });
  console.log('######emails', emails);
  return _.first(emails);
};

/**
 * Returns true for any user
 */
const isAny = (userId, doc) => {
  return true;
};

const isNone = (userId, doc) => {
  return false;
};

const isAdminOrOwner = (userId, doc) => {
  return isAdmin(userId) || isOwner(userId, doc);
};

const anyCreateAdminOwnersUpdateRemove = {
	insert: isAny,
	update: isAdminOrOwner,
	remove: isAdminOrOwner
};

const adminCreateUpdateRemove = {
	insert: isAdmin,
	update: isAdmin,
	remove: isAdmin
};

const anyInsertAdminUpdateRemove = {
	insert: isAny,
	update: isAdmin,
	remove: isAdmin
};

const noAccess = {
  insert: isNone,
  update: isNone,
  remove: isNone,
};

export default {
  userLabel: userLabel,
  isAdmin: isAdmin,
  isOwner: isOwner,
  isAny: isAny,
  isAdminOrOwner: isAdminOrOwner,
  isUser: isUser,
  anyCreateAdminOwnersUpdateRemove: anyCreateAdminOwnersUpdateRemove,
  adminCreateUpdateRemove: adminCreateUpdateRemove,
  anyInsertAdminUpdateRemove: anyInsertAdminUpdateRemove,
  noAccess: noAccess
};
