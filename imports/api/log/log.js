/*jshint esversion: 6 */
import { _ } from 'underscore';
import { Meteor } from 'meteor/meteor';
import Chalk from 'chalk';
import AnsiUp from 'ansi_up';
import renameKeys from 'deep-rename-keys';

let ansi_up;
if(Meteor.isClient) {
  ansi_up = new AnsiUp();
}

// init chalk instance and force it to use 256 colors
const chalk = new Chalk.constructor({enabled: true, level: 2});

// @see https://github.com/hansifer/ConsoleFlair/blob/master/src/consoleFlair.js
function styledConsoleLog() {
    var argArray = [];

    if (arguments.length) {
        var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
        var endTagRe = /<\/span>/gi;

        var reResultArray;
        argArray.push(arguments[0].replace(startTagRe, '%c').
            replace(endTagRe, '%c'));
        while (reResultArray = startTagRe.exec(arguments[0])) {
            argArray.push(reResultArray[2]);
            argArray.push('');
        }

        // pass through subsequent args since chrome dev tools does not (yet)
        // support console.log styling of the following form:
        //   console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
        for (var j = 1; j < arguments.length; j++) {
            argArray.push(arguments[j]);
        }
    }
    // console.log.apply(console, argArray);
    return argArray;
}

/**
 * Normalise an object for printing and persistance.
 * @param object {any} - an object to be normalised, safe from mutation
 * @returns {any} - normalised deep clone of input object
 **/

const normalize = (object, level) => {
  level = _.isNumber(level)?level+1:0;
  if (level > 10) {
    return 'DEEP';
  }
  if (_.isUndefined(object)) {
    return 'UNDEFINED';
  }
  if (_.isFunction(object)) {
    return 'FUNCTION';
  }
  if (_.isArray(object)) {
    const clone = [];
    for (let child of object) {
      clone.push(normalize(child), level);
    }
    return clone;
  }
  if (_.isObject(object)) {
    const clone = {};
    const childKeys = _.keys(object);
    for (let key of childKeys) {
      let cloneChildKey;
      switch (key) {
        case '$set': cloneChildKey = 'set'; break;
        case '$push': cloneChildKey = 'push'; break;
        default: break;
      }
      clone[cloneChildKey] = normalize(object[key], level);
    }
    return clone;
  }
  return object;
};

/**
 * Use standard streams for logging on the console?
 * Default is true
 **/
 let isStandardStreams = true;
 const standardStreams = (state) => {
   isStandardStreams = state;
 };

/**
 * Indent the message?
 **/
 let messageIndentSize = 0;
 const messageIndent = (size) => {
   messageIndentSize = size;
 };

/**
 * Muted tags are not logged on the console, but they are logged in the DB
 * @param {string[]} tags - The tags to mute on the console.
 **/
let mutedTags = [];
const mute = tags => { mutedTags = _.union(mutedTags, tags); };

/**
 * Unmute tags.
 * @param {string[]} tags - The tags to show on the console.
 **/
const show = tags => { mutedTags = _.without(mutedTags, ...tags); };

/**
 * Show all tags.
 **/
const showAll = () => {
  mutedTags = [];
};

/**
 * Build a tag string with colors for the platform and environment
 * @param {string[]} tags - The tags to build a string for.
 * @returns {string} The tag string to log on the console.
 **/
const buildTagString = (tags) => {

   // for each tag
   let tagString = '';
   for (let tag of tags) {

     // find color object
     const obj = colors[tag];

     // if color object exists and host supports color
     let supportsColor = true;
     if (Meteor.isServer) {
       supportsColor = Meteor.settings.host &&
          !_.isUndefined(Meteor.settings.host.supportsColorLogs)?
          Meteor.settings.host.supportsColorLogs:supportsColor;
     }
     if (obj && supportsColor) {

       const isColor = _.isString(obj.color);
       const isBgColor = _.isString(obj.bgColor);

       // if text color and bgColor
       if (isColor && isBgColor) {

         // nested chalk tag using color in bgColor
         tagString +=
             `${chalk.keyword(obj.color)(chalk.bgKeyword(obj.bgColor)(tag))} `;
       }

       // else if text color is a function
       else if (isColor) {

         // chalk and append tag with color to tag string
         tagString += `${chalk.keyword(obj.color)(tag)} `;
       }

       // else if background color is a function
       else if (isBgColor) {

         // chalk and append tag with background color to tag string
         tagString += `${chalk.bgKeyword(obj.bgColor)(tag)} `;
       }

       // else
       else {

         // append the tag
         tagString += tag+' ';
       }
     }

     // else
     else {

       // append the tag
       tagString += tag+' ';
     }
   }

   // trim whitespace of tag string
   tagString = tagString.trim();

   //return tag string
   return tagString;
};

/**
 * Build an indented message.
 * @param {string} tagString - The tag string to offset the indent.
 * @param {string} message - The plain unindented message.
 * @param {number} messageIndent - The left indent offset.
 * @return {string} - The indented message.
 **/
const buildMessageString = (tags, tagString, message, messageIndent) => {

  // if tag string is empty
  if (_.isEmpty(tagString)) {

    // if indenting
    if (messageIndent>0) {

      // generate padding
      let padding = '';
      const iSize = Meteor.isServer?(messageIndent+3):(messageIndent+2);
      for(let i = 0; i < iSize; i++) { padding+=' '; }

      // left pad the message
      message = padding + ': '+ message;
    }

    // else - message is not indented
    else {

      // add seperator
      message = message;
    }
  }

  // else - there is a tag string
  else {

    // if message is indented
    if (messageIndentSize>0) {

      // calculate the string lengths of tags
      let tagsLength = 0;
      for(let tag of tags) {
        tagsLength += tag.length+1;
      }
      tagsLength-=1;

      // calculate padding size
      let paddingSize = messageIndentSize - tagsLength;

      // normalise padding
      paddingSize = paddingSize>0?paddingSize:0;

      // generate padding
      let padding = '';
      for(let i = 0; i < paddingSize; i++) { padding+=' '; }

      // left pad the message
      message = padding + ': ' + message;
    }

    // else - message is not indented
    else {

      // add seperator
      message = ': ' + message;
    }
  }

  return message;
};

/**
 * Returns true if the log should be muted
 * @param {string[]} tags - the log tags
 * @returns {boolean} - true if log should be muted
 **/
const isMuted = (tags) => {

  // if tags include debug and the environment is production
  if (_.contains(tags, 'debug') && Meteor.settings.public.isProduction) {

    // return true
    return true;
  }

  // if information tag is present
  if (_.contains(tags, 'information')) {

    // return true
  }

  // if there are muted tags
  if (mutedTags.length > 0) {

    // if any of the log tags are in the muted tags list
    const mutedTag = _.find(tags, (tag) => {
      return _.contains(mutedTags, tag);
    });
    if (mutedTag) {

      // return true
      return true;
    }

    // else
    else {

      // return false
      return false;
    }
  }

  // else - there are no muted tags configured
  else {

    // return false
    return false;
  }
};

/**
 * Color a tag using Chalk.
 * @param {string} tag - The tag that will get a color assigned.
 * @param {string} color - The Chalk color, e.g. 'black'.
 * @param {string} bgColor - The Chalk background color, e.g 'bgYellow'.
 * @see {@link https://github.com/chalk/chalk|Chalk}
 * @example
 * // Log.color('error', 'white', 'bgRed);
 * // Log.log(['error'], 'This error and all following logs with error tags');
 * // Log.log(['error'], 'will be white text on a red background.');
 * @returns {undefined} Returns undefined.
 *
 **/
let colors = {};
const color = (tag, color, bgColor) => {

  // find or create object using tag as color key
  let obj = colors[tag] = tag&&colors[tag]?colors[tag]:{};

  // if a color is provided
  if(color && _.isString(color)) {

    // assign the color to the tag color object
    obj.color = color;
  }

  // if a background color is provided
  if (bgColor && _.isString(bgColor)) {

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

  // determine server time
  const time = new Date();

  // if log is not muted
  if (!isMuted(tags)) {

    // define ES2015 template literal for use with Chalk
    let tagString = buildTagString(tags);

    // prepend tag string, indent and pack message
    let indentedMessage = buildMessageString(tags, tagString, message,
        messageIndentSize);

    // if client environment
    let args, tagArgs;
    if (Meteor.isClient) {

      // convert ansi tag string to html
      const tagHtml = ansi_up.ansi_to_html(tagString);
      tagArgs = styledConsoleLog(tagHtml);

      // add message string to the first tag argument
      tagArgs[0] = tagArgs[0] + indentedMessage;

      // pack args with deconstructed tag args and data
      args = data.length>0?[...tagArgs, ...data]:[...tagArgs];
      // console.log('args:', args);
    }

    // else - not client, thus server
    else {

        // pack args with tag string
        args = data.length>0?
            [tagString, indentedMessage, ...data]:
            [tagString, indentedMessage];
    }

    // if using standard streams
    if (isStandardStreams) {

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

    // else - not using standard streams
    else {

      // log everything on the log stream
      console.log(...args);
    }

    //normalise the data for persistance
    // console.log('data to normalize:', data);
    const normalizedData = normalize(data);

    // determine the node type
    const node = Meteor.isClient?'client':'server';

    // insert with user id if it exists
    // user id is not available server side outside publications and methods
    try {
      const userId = Meteor.userId();

      Logs.insert({
        time,
        node,
        userId: Meteor.userId(),
        tags: tags,
        message: message,
        data: normalizedData
      });
    } catch (e) {
      Logs.insert({
        time,
        node,
        tags: tags,
        message: message,
        data: normalizedData
      });
    }
  }

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
  standardStreams: standardStreams,
  messageIndent: messageIndent,
  mute: mute,
  show: show,
  showAll: showAll,
  log: log,
  info: info,
  warn: warn,
  error: error,
  debug: debug,
  color: color
};
