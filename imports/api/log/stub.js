/* jshint esversion: 6 */
import Sinon from 'sinon';
import Log from './log.js';

/**
 * Stub for Log module. Should be used by other modules during unit testing.
 *
 * @example
 * //see inline template below
 */
// import Log from '../../log';
// import LogStub from '../../log/stub';
// import {h1} from '../text/frame';
// if(Meteor.isServer) {
//   const tm1 = 'Test Module: ';
//   describe(tm1, function () {
//
//     beforeEach(function () {
//       LogStub.stub(['module'], true);
//     });
//
//     afterEach(function () {
//       LogStub.restore();
//     });
//
//     const t1 = 'test name';
//     it(t1, function(done) {
//       Log.log(['module', 'debug'], h1(tm1+': '+t10));
//       done();
//     });
//   });
// }


/**
 * @param {array[string]} tags - console log only these tags
 */
const stub = (onTags, mute) => {

  //input normalisation
  onTags = onTags?onTags:[];
  mute = mute?true:false;

  // console.warn('LOGSTUB', onTags, mute);

  //fake log function for controlled logging during test driven development
  const fake = function (tags, msg, ...data) {
    const args = data.length>0?[msg, ...data]:[msg];
    // console.warn('TAGS', tags);
    const on = _.find(tags, function (tag) {
      if(_.contains(['debug', 'information', 'error', 'warning'], tag)) {
        return false;
      }
      return _.contains(onTags, tag);
    })?true:false;
    // console.warn('ON', on);
    // console.warn('MUTE', mute);
    const logOnConsole = on && !mute;
    // console.warn('CONSOLE', logOnConsole);
    if (_.contains(tags, 'error')) {
      if(logOnConsole) {
        console.error(...args);
      }
      throw new Meteor.Error(msg);
    }
    if (_.contains(tags, 'information') && logOnConsole) {
      console.info(...args);
    }
    if (_.contains(tags, 'warning') && logOnConsole) {
      console.info(...args);
    }
    if (_.contains(tags, 'debug') && logOnConsole) {
      console.log(...args);
    }
  };

  //stub Log.log with fake
  try {
    Sinon.stub(Log, 'log').callsFake(fake);
  } catch (e) {
    console.error(e);
    Log.log.restore();
    Sinon.stub(Log, 'log').callsFake(fake);
  }
};

const restore = () => {
  Log.log.restore();
};

export default {
  stub: stub,
  restore: restore
};
