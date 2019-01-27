// imports
import { Log as LogApi, logs as LogsCollection } from './imports/api/log.js'
import { check } from 'meteor/check'

// exports
export const Log = LogApi
export const Logs = LogsCollection

// constants
const MAX_LIMIT = 1000

// on startup
Meteor.startup(() => {

  // publish logs to admin users
  Meteor.publish('meteor-logs', function (limit) {

    // input validation
    check(limit, Number)

    // if current user is admin
  	if (Roles.userIsInRole(this.userId, 'admin')) {

      // return logs
      const result = Logs.find({}, {
        sort: {time: -1},
        limit: Math.min(limit, MAX_LIMIT)
      })
      console.log('publish result', result.fetch())
      return result
    }
  	this.ready()
  })
})
