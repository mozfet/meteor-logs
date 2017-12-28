# meteor-logs

Real cross platform logs for Meteor. With multiple mutable colored tags and
managed console streams, it quick to install and easy to use, ideal for test
driven development and production logging.

Logs can be created from anywhere in client and server, startup and runtime,
even inside methods. Logs with debug tags are automatically and completely
ignored on production environments. Database logs are only accessible by Meteor
users with admin roles.

Templates are included for logging from Blaze templates, and for searching and
presenting filtering logs. (Coming Soon)

## Base API

The API provides support for colored tagged logs with human messages and
flexible data.
```
Log.color('error', Chalk.black, Chalk.bgRed);
Log.log(['tag1', 'tag2'], 'Human message.', 'some', 'data', {foo: 'bar'}, 42);
```

## Polimorphic

Works the same anywhere in a Meteor client or server
```
Log.info('All logs on the server and client (except debug on prod) are stored '+
    'in the \'Log\' MongoDB collection.');
Meteor.onStartup(() => {
  if (Meteor.isServer) {
    Log.info('Logs on the server does not show on the client console');

    Meteor.methods({myMethod: ()=>{Log.info('wow')}};    
  }
  else if (Meteor.isClient) {
    Log.info('Logs on the client does not show on the server console');
  }  
});

```

## Managed console log streams

Shorthand is handy for quick easy logging.
```
Log.info('Log on console info stream and the database.');
Log.warn('Log on console warning stream and the database.', 7);
Log.error('Log on console error stream and the database', {foo: 'bar'});
Log.debug('Log on console debug stream and the database', 'some', 'data');
```

Shorthand Resolves to default system managed log streams:
```
console.log(' information : Log on console info stream and the database.');
console.warn(' warning : Log on console info stream and the database.', 7);
console.error(' error : Log on console error stream and the database',
    {foo: 'bar'});
console.log(' debug : Log on console error stream and the database',
    'some', 'data');
```

Special purposes tags are used when custom tags are added (information, warning,
error, debug):
```
Log.log(['information'], 'Log on console info stream and the database.');
Log.log(['warning', 'nonSpecialTag', 'anotherTag'],
    'Log on console warning stream and the database.', 7);
Log.log(['error', 'someTag'], 'Log on console error stream and the database',
    {foo: 'bar'});
Log.log(['debug', 'tag1'], 'Log on console error stream and the database',
    'some', 'data');
```

## Smart Debug

Debug logs are completely auto ignored in production environments
```
Log.debug('Debug logs are completely auto ignored in production environments',
    {foo: ['bar']}, loads, ofOther, objects, andLiterals);
Log.log(['debug', 'someFeature'],
    'Debug logs are completely auto ignored in production environments',
    {foo: ['bar']}, 'loads of other objects and arrays and literals',
    ['A', 'B', {C: 'C'}] , 42);
```

## Tag filtering on the console

Logs than contain a tag can be easily silenced on the console. Note that muted
tags are still logged in database.
```
Log.mute('veryBusy');
Log.log(['veryBusy'], 'Muted logs do not show on the console');
Log.log(['veryBusy'], 'Muted logs are logged in the database.');
Log.show('veryBusy');
Log.log(['veryBusy'], 'And can be unmuted when appropriate');
```

## Color tags on the console

Easily change the color and background of a tag on the console.

```
Log.color('error', 'black', 'red');
Log.color('myTag', 'white', 'green');
Log.log(['error', 'myTag'], 'Colors can be added to any tag.');
Log.color('error');
Log.color('myTag', 'green', 'black');
Log.error('Colors can be reset or changed at any time');
```

Color tags are an optional feature. If you do not need it, then no need
to install or include Chalk.

Note that changing the color of a tag on the client does not change the color of
the tag on the server, unless it is done in imports/startup/both.

## Atmosphere Package

### Installation

On the console:
```
$ meteor npm import chalk --save
$ meteor add mozfet:meteor-logs
```

### Useage

In client or server code using the global object:
```
import Chalk from 'chalk';
Log.color('information', Chalk.black, Chalk.bgYellow);
Log.info('Using Atmosphere makes it easy.');
```

## Node Package (Coming Soon)

### Installation

On the console (using chalk is optional):
```
$ meteor npm import chalk --save
$ meteor npm import meteor-logs --save
```

### Useage

Inside any code on the client or server:
```
import Chalk from 'chalk';
import Log from 'meteor-logs';
Log.color('information', Chalk.black, Chalk.bgYellow);
Log.info('Using Node Package Manager makes it standard.');
```
