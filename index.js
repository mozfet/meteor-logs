/*jshint esversion: 6 */
import { Mongo } from 'meteor/mongo';
import LogApi from './imports/api/log';
import Access from './imports/api/access';
import renameKeys from 'deep-rename-keys';

// export log api
Log = LogApi;

// on meteor startup
// Meteor.startup(() => {

// define global mongo db collection
Logs = new Mongo.Collection('logs');

/**
 * Normalise data for persistance so that db queries can also be saved.
 * @param {object} document - The document to Normalize
 * @returns {object} The normalized document.
 **/
const normalizeForPersistance = (document) => {
  renameKeys(document, function(key) {
    switch(key) {
      case '$set': return 'SET';
      case '$push': return 'PUSH';
      default: return key;
    }
  });
};

// if in meteor server environment
if (Meteor.isServer) {

  // define meteor methods
  Meteor.methods({
    // log: (tags, message, data) => {
    //
    //   //normalise the data for persistance
    //   const normalizedData = normalizeForPersistance(data);
    //
    //   //insert log into db
    //   Logs.insert({
    //     time: new Date(),
    //     userId: Meteor.userId(),
    //     tags: tags,
    //     message: message,
    //     data: normalizedData
    //   });
    // },
    'log.tags': () => {
      let tags = Logs.aggregate([
        {$unwind: '$tags'},
        {$group: {_id: '$tags'}}
      ]);
      tags = _.map(tags, (tag) => {return tag._id;});
      // console.log('log.tags:', tags);
      return tags;
    },
    'log.clear': () => {
      Logs.remove({});
    }
  });

  // allow on admin to insert, update and remove on client
  Logs.allow(Access.anyInsertAdminUpdateRemove);

  // publish logs to admin users
  Meteor.publish('logs', () => {
    if (Access.isAdmin()) {
      const logs = Logs.find({});
      console.log('publishing '+logs.count()+' logs for admin user');
      return logs;
    }
    return undefined;
  });
}
// });
