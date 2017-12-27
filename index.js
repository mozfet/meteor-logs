/*jshint esversion: 6 */

import LogApi from './imports/api/log';
import Access from 'meteor/access';

// export default log api
export default LogApi;

// define mongo db
Logs = new Mongo.Collection('Logs');

// define global Log
Log = LogApi;

// on meteor startup
Meteor.onStartup(() => {



  // if server
  if (Meteor.isServer) {

    const normalizeForPersistance = (document) => {
      renameKeys(document, function(key) {
        switch(key) {
          case '$set': return 'SET';
          case '$push': return 'PUSH';
          default: return key;
        }
      });
    };

    // define access
    //define meteor methods
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

    // allow any client to insert logs, but only admin can update and remove
    Logs.allow(Access.anyInsertAdminUpdateRemove);
  }
});
