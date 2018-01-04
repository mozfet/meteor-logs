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
Logs = new Mongo.Collection('Logs');

// function to prepare data for persistance
const normalizeForPersistance = (document) => {
  renameKeys(document, function(key) {
    switch(key) {
      case '$set': return 'SET';
      case '$push': return 'PUSH';
      default: return key;
    }
  });
};

// define meteor methods
Meteor.methods({
  log: (channels, message, data) => {

    //normalise the data for persistance
    const normalizedData = normalizeForPersistance(data);

    //insert log into db
    Logs.insert({
      time: new Date(),
      userId: Meteor.userId(),
      channels: channels,
      message: message,
      data: normalizedData
    });
  },
  'log.channels': () => {
    let channels = Logs.aggregate([
      {$unwind: '$channels'},
      {$group: {_id: '$channels'}}
    ]);
    channels = _.map(channels, (channel) => {return channel._id;});
    console.log('log.channels:', channels);
    return channels;
  },
  'log.clear': () => {
    Logs.remove({});
  }
});

// if in meteor server environment
if (Meteor.isServer) {

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
