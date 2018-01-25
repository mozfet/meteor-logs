/* jshint esversion: 6 */
import Sinon from 'sinon';
import hasAnsi from 'has-ansi';

if(Meteor.isClient) {

  Tinytest.add(
    'MeteorLogs - Debug on DEV on Console',
    function (test) {

      // stub the console
      let consoleLogArgs;
      Sinon.stub(console, 'log').callsFake((...args) => {
        consoleLogArgs = args;
      });

      // log something
      Log.log(['debug'],'Hello');

      // restore the stub
      console.log.restore();

      // evaluate the result
      test.equal(consoleLogArgs.length, 1, 'Expected 1 arguments.');
      test.equal(consoleLogArgs[0], 'debug: Hello', 'Expected first argument to be the tag and message');
    }
  );

  Tinytest.add(
    'MeteorLogs - Debug on DEV with Indent on Console',
    function (test) {

      // stub the console
      let consoleLogArgs;
      Sinon.stub(console, 'log').callsFake((...args) => {
        consoleLogArgs = args;
      });

      // set an indent on the log
      Log.messageIndent(10);

      // log something
      Log.log(['debug'],'Hello');

      // restore the stub
      console.log.restore();

      // evaluate the result
      test.equal(consoleLogArgs.length, 1, 'Expected 1 arguments.');
      test.equal(consoleLogArgs[0], 'debug     : Hello', 'Expected first argument to be the tag and indented message');
    }
  );

  Tinytest.add(
    'MeteorLogs - Information on DEV with Color on Console',
    function (test) {

      // setup a sandbox
      var sandbox = Sinon.createSandbox();

      // stub the console
      let consoleLogArgs;
      sandbox.stub(console, 'info').callsFake((...args) => {
        consoleLogArgs = args;
      });

      // assign colors to information tag
      Log.color('information', 'black', 'white');

      // log something
      Log.log(['information'],'Hello');

      // evaluate the result
      test.equal(consoleLogArgs.length, 3, 'Expected 3 arguments.');
      test.equal(consoleLogArgs[0], '%cinformation%c: Hello', 'Expected first argument to be the tag and message template');
      test.equal(consoleLogArgs[1], 'color:rgb(0,0,0);background-color:rgb(255,255,255)', 'Expected second argument to be the tag color');
      test.equal(consoleLogArgs[2], '', 'Expected third argument to be the empty');

      // restore the sandbox
      sandbox.restore();
    }
  );

}

if(Meteor.isServer) {

  Tinytest.add(
    'MeteorLogs - Debug on DEV on Console',
    function (test) {

      // stub the console
      let consoleLogArgs;
      Sinon.stub(console, 'log').callsFake((...args) => {
        consoleLogArgs = args;
      });

      // log something
      Log.log(['debug'],'Hello');

      // restore the stub
      console.log.restore();

      // evaluate the result
      test.equal(consoleLogArgs.length, 2, 'Expected 2 arguments.');
      test.equal(consoleLogArgs[0], 'debug', 'Expected first argument to be the tag');
      test.equal(consoleLogArgs[1], ': Hello', 'Expected first argument to be the message');
    }
  );

  Tinytest.add(
    'MeteorLogs - Debug on DEV with Indent on Console',
    function (test) {

      // stub the console
      let consoleLogArgs;
      Sinon.stub(console, 'log').callsFake((...args) => {
        consoleLogArgs = args;
      });

      // set an indent on the log
      Log.messageIndent(10);

      // log something
      Log.log(['debug'],'Hello');

      // reset the indent
      Log.messageIndent(0);

      // evaluate the result
      test.equal(consoleLogArgs.length, 2, 'Expected 2 arguments.');
      test.equal(consoleLogArgs[0], 'debug', 'Expected first argument to be the tag');
      test.equal(consoleLogArgs[1], '     : Hello', 'Expected first argument to be the message');

      // restore the stub
      console.log.restore();
    }
  );

  Tinytest.add(
    'MeteorLogs - Information on DEV with Color on Console',
    function (test) {

      // setup a sandbox
      var sandbox = Sinon.createSandbox();

      // stub the console
      let consoleLogArgs;
      sandbox.stub(console, 'info').callsFake((...args) => {
        consoleLogArgs = args;
      });

      // assign colors to information tag
      Log.color('information', 'black', 'white');

      // log something
      Log.log(['information'],'Hello');

      // evaluate the result
      test.equal(consoleLogArgs.length, 2, 'Expected 2 arguments.');
      test.isTrue( hasAnsi(consoleLogArgs[0]),
          'Expected first argument to be the tags ansi sequence');
      test.equal(consoleLogArgs[1], ': Hello',
          'Expected second argument to be the message');

      // restore the sandbox
      sandbox.restore();
    }
  );
}

Tinytest.add(
  'MeteorLogs - Debug on PROD Console',
  function (test) {

    // setup a sandbox
    var sandbox = Sinon.createSandbox();

    // create a spy on the console
    const spy = sandbox.spy(console, 'log');

    //stub prod environment in the sandbox
    sandbox.stub(Meteor.settings, 'public').value({isProduction:true});

    // log something
    Log.log(['debug'],'Hello');

    // evaluate the result
    test.isTrue(spy.notCalled, 'Expected console log function to not have been called.');

    // restore the sandbox
    sandbox.restore();
  }
);

Tinytest.add(
  'MeteorLogs - Information on PROD Console',
  function (test) {

    // setup a sandbox
    var sandbox = Sinon.createSandbox();

    // create a spy on the console
    const spy = sandbox.spy(console, 'info');

    //stub prod environment in the sandbox
    sandbox.stub(Meteor.settings, 'public').value({isProduction:true});

    // log something
    Log.log(['information'],'Hello');

    // evaluate the result
    test.isTrue(spy.calledOnce, 'Expected console info function to have been called once.');

    // restore the sandbox
    sandbox.restore();
  }
);

Tinytest.add(
  'MeteorLogs - Custom tags muted and then shown on Console',
  function (test) {

    // create a spy on the console
    const spy = Sinon.spy(console, 'log');

    // mute foo
    Log.mute(['foo']);

    // log something with foo
    Log.log(['foo', 'bar'], 'This should be muted on the console.');

    // evaluate the result
    test.equal(spy.callCount, 0, 'Unexpected call of console log.');

    //show foo
    Log.show(['foo']);

    // log something with foo
    Log.log(['foo', 'bar'], 'This should be shown on the console');

    // evaluate the result
    test.equal(spy.callCount, 1, 'Expected console log function to have been called once.');

    // restore the console log
    spy.restore();
  }
);

Tinytest.add(
  'MeteorLogs - Information on DEV not using Standard Streams on Console',
  function (test) {

    // setup a sandbox
    var sandbox = Sinon.createSandbox();

    // create a spy on the console
    const spy = sandbox.spy(console, 'log');

    // deactivate standard streams
    Log.standardStreams(false);

    // log something
    Log.log(['information'],'Hello');

    // activate standard streams
    Log.standardStreams(true);

    // evaluate the result
    test.isTrue(spy.calledOnce, 'Expected console log function to have been called once.');

    // restore the sandbox
    sandbox.restore();
  }
);

Tinytest.add(
  'MeteorLogs - Warning on Database',
  function (test) {

    // setup a sandbox
    var sandbox = Sinon.createSandbox();

    // create a spy on the database collection
    let doc;
    sandbox.stub(Logs, 'insert').callsFake((d) => {
      doc = d;
    });

    // stub the user id
    sandbox.stub(Meteor, 'userId').callsFake(() => {
      return '1111';
    });

    // use fake timers
    const now = new Date();
    sandbox.useFakeTimers(now);

    // log something
    Log.log(['warning'],'Hello');

    // evaluate the result
    test.isTrue(Logs.insert.calledOnce, 'Expected log to be inserted into database.');
    test.equal(
      doc,
      {
        time: now,
        userId: '1111',
        channels: ['warning'],
        message: 'Hello',
        data: undefined
      },
      'Expected document to match.'
    );

    // restore the sandbox
    sandbox.restore();
  }
);
