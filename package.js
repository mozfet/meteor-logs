Package.describe({
  name: 'mozfet:meteor-logs',
  summary: 'Cross platform, pretty, filtered, polymorphic, console and database logging for Meteor.',
  version: '0.1.10',
  git: 'https://github.com/mozfet/meteor-logs'
});

Npm.depends({
  'escape-string-regexp': '1.0.5',
  'chalk': '2.3.0',
  'deep-rename-keys': '0.2.1',
  'ansi_up': '2.0.2'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');
  api.use(['meteor', 'mongo', 'underscore'], ['client', 'server']);
  api.use(['templating', 'blaze'], 'client');
  api.use('ecmascript@0.7.2');
  api.addFiles([
    'index.js'
  ], ['client', 'server']);
  api.export('Log', ['client', 'server']);
});

Package.on_test(function(api) {
  api.use(
    [
      'tinytest',
      'test-helpers',
      'accounts-base',
      'underscore',
      'babel-runtime'
    ],
    ['client', 'server']
  );
  api.use('ecmascript@0.7.2');
  api.addFiles([
    'index.js',
    './test/log.test.js'
  ], ['client', 'server']);
  api.export('Log', ['client', 'server']);
});
