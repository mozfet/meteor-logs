// imports
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Log as LogApi, logs as LogsCollection } from './imports/api/log.js'

// exports
export const Log = LogApi
export const Logs = LogsCollection

// on startup
Meteor.startup(() => {

  // worker redirect function
  const redirectNonAdminToHome = function (context, redirect) {
    const userId = Meteor.user()
    const isAdmin = Roles.userIsInRole(userId, ['admin'])
    if(!isAdmin) {
      redirect('/')
    }
  }

  // define route
  FlowRouter.route('/logs', {
    name: 'logs',
    triggersEnter: [redirectNonAdminToHome],
    action: async function(params, queryParams) {
      await import('./imports/ui/pages/meteorLogs.js')
      BlazeLayout.render('meteorLogs')
    }
  })
})
