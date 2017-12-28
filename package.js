Package.describe({
  name: 'mozfet:meteor-logs',
  summary: 'Polymorphic colored tagged filtered logging for Meteor on MongoDB, server terminal and browser console.',
  version: '0.0.4',
  git: 'https://github.com/mozfet/meteor-logs'
});

Npm.depends({
  'chalk': '2.3.0',
  'deep-rename-keys': '0.2.1',
  'ansi-html': '0.0.7'
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
