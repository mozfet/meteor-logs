// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { EJSON } from 'meteor/ejson'
import { logs } from '../../api/log.js'
import moment from 'moment'
import './meteorLogs.html'

// constants
const SHOW_MORE = 25

// on created
Template.meteorLogs.onCreated(() => {
  const instance = Template.instance()
  instance.state = new ReactiveDict()
  instance.state.set('logEntriesCount', SHOW_MORE)
  instance.autorun(() => {
    const logEntriesCount = instance.state.get('logEntriesCount')
    instance.subscribe('meteor-logs', logEntriesCount)
  })
})

// on rendered
Template.meteorLogs.onRendered(() => {
  const instance = Template.instance()
  $(window).on('scroll.mozfetMeteorLogs', e => {
    const documentElement = document.documentElement
    const offset = documentElement.scrollTop + window.innerHeight
    const height = documentElement.offsetHeight
    if (offset === height) {
      let logEntriesCount = instance.state.get('logEntriesCount')
      logEntriesCount += SHOW_MORE
      instance.state.set('logEntriesCount', logEntriesCount)
    }
  })
})

// helpers
Template.meteorLogs.helpers({
  logEntries() {
    const instance = Template.instance()
    const result = logs.find({}, {sort: {time: -1}}).fetch()
    return result
  },
  date(date) {
    const stringDate = moment(date).format('YYYYMMDD HH:mm:ss.SSS')
    return stringDate
  },
  prettyPrint(data) {
    if(typeof data === 'object') {
      return EJSON.stringify(data, {indent: true})
    }
    return data
  }
})

// on destroyed
Template.meteorLogs.onDestroyed(() => {
  const instance = Template.instance()
  $(window).off('scroll.mozfetMeteorLogs')
})
