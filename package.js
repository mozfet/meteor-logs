Package.describe({
  name: 'mozfet:meteor-logs',
  summary: 'Cross platform, pretty, filtered, polymorphic, console and database logging for Meteor.',
  version: '0.3.1',
  git: 'https://github.com/mozfet/meteor-logs'
});

Npm.depends({
  'escape-string-regexp': '1.0.5',
  'chalk': '2.3.0',
  'deep-rename-keys': '0.2.1',
  'ansi_up': '2.0.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0.1');
  api.use([
    'ecmascript',
    'underscore',
    'mozfet:access@0.0.4'
  ]);
  api.use([
    'templating@1.3.2',
    'blaze@2.3.3'
  ], 'client');
  api.mainModule('./main.js');
  api.export(['Log', 'Logs']);
});
