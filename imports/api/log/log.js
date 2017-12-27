/*jshint esversion: 6 */

/**
 * Muted tags are not logged on the console, but they are logged in the DB
 * @param {string[]} tags - The tags to mute on the console.
 **/
let mutedTags = [];
const mute = (tags) => {
  mutedTags = _.union(mutedTags, tags);
};

/**
 * Unmute tags
 * @param {string[]} tags - The tags to show on the console.
 **/
const show = (tags) => {
  mutedTags = _.without(mutedTags, ...tags);
};

/**
 * Color a tag using Chalk.
 * @param {string} tag - The tag that will get a color assigned.
 * @param {function} color - The Chalk color, e.g. Chalk.black.
 * @param {function} bgColor - The Chalk background color, e.g Chalk.bgYellow.
 * @see {@link https://github.com/chalk/chalk|Chalk}
 * @example
 * // in terminal console:
 * //   $ meteor npm import chalk --save
 * //   $ meteor npm import meteor-logs --save
 * // anywhere in client or server code:
 * // import Chalk from 'chalk';
 * // import Log from 'meteor-logs';
 * // Log.color('error', Chalk.black, Chalk.bgRed);
 * // Log.log(['error'], 'This error and all following logs with error tags');
 * // Log.log(['error'], 'will be black text on a red background.');
 * @returns {undefined} Returns undefined.
 *
 **/
let colors = {};
const colour = (tag, color, bgColor) => {

  // find or create object using tag as color key
  let obj = colors[tag] = tag&&colors[tag]?colors[tag]:{};

  // if a color is provided
  if(color && _.isFunction(color)) {

    // assign the color to the tag color object
    obj.color = color;
  }

  // if a background color is provided
  if (bgColor && _.isFunction(bgColor)) {

    // assign the background color to the object
    obj.bgColor = bgColor;
  }

  // return undefined
  return undefined;
};

/**
 * Core polymorphic API to log a message with tags and data.
 * When debug is muted, it will also not be included anywhere
 * @param {string[]} tags - Tags used to classify the log for muting and color.
 * @param {string} message - The human friendly message to log.
 * @param {any} data - Data to be logged, not included in concise logging.
 **/
const log = (tags, message, ...data) => {

  // if tags contain debug and this is a production envorinment
  if (Meteor.settings.public.isProduction && _.contains(tags, 'debug')) {

    // do nothing
    return undefined;
  }

  // for each tag
  let tagString = '';
  for (let tag of tags) {

    // find color object
    const obj = colors[tag];

    // if color object exists
    if (obj) {

      const isColor = _.isFunction(obj.color);
      const isBgColor = _.isFunction(obj.bgColor);

      // if text color and bgColor
      if (isColor && isBgColor) {

        // nested chalk tag using color in bgColor
        tagString += ' ' + obj.bgColor(obj.color(tag)) + ' ';
      }

      // else if text color is a function
      else if (isColor) {

        // chalk and append tag with color to tag string
        tagString += obj.color(tag);
      }

      // else if background color is a function
      else if (isBgColor) {

        // chalk and append tag with background color to tag string
        tagString += obj.bgColor(tag);
      }

      // else
      else {

        // append the tag
        tagString += tag;
      }
    }

    // else
    else {

      // append the tag
      tagString += tag;
    }
  }

  const args = data.length>0?[tagString, message, ...data]:[tagString, message];
  if (_.contains(tags, 'error')) {
    console.error(...args);
  }
  else {

    //if none of the tags are in the do not log list
    const tagsInTheDoNotLogOnConsoleList = _.filter(tags, (tag) => {
      return _.contains(doNotLogOnConsoleList, tag);
    });
    if (tagsInTheDoNotLogOnConsoleList.length === 0) {

      //log on console using default io streams
      if (_.contains(tags, 'warning')) {
        console.warn(...args);
      }
      else if (_.contains(tags, 'information')) {
        console.info(...args);
      }
      else {
        console.log(...args);
      }
    }
  }

  //polymorphic database logging
  Meteor.call('log', tags, message, data);

  //throw meteor errors for logs with error codes
  if (_.contains(tags, 'error')) {
    throw new Meteor.Error(message, data);
  }
};

/**
 *
 **/
const info = (msg, ...data) => {
  log(['information'], msg, ...data);
};

/**
 *
 **/
const warn = (msg, ...data) => {
  log(['warning'], msg, ...data);
};

/**
 *
 **/
const error = (msg, ...data) => {
  log(['error'], msg, ...data);
};

/**
 *
 **/
const debug = (msg, ...data) => {
  log(['debug'], msg, ...data);
};

/**
 * Export API as Default
 **/
export default {
  mute: mute,
  show: show,
  log: log,
  info: info,
  warn: warn,
  error: error,
  debug: debug
};
