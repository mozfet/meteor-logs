// imports
import { Log as LogApi, logs as LogsCollection } from './imports/api/log.js'

// exports
export const Log = LogApi
export const Logs = LogsCollection

// on startup
Meteor.startup(() => {

  Router.register({
    logs: async parameters => {
      await import('./imports/ui/pages/meteorLogs.js')
      BlazeLayout.render('meteorLogs')
    }
  })
})
