Package.describe({
  name: 'mozfet:meteor-logs',
  summary: 'Polymorphic colored tagable filtered logging for Meteor on MongoDB and the console.',
  version: '0.0.1',
  git: 'https://github.com/mozfet/meteor-logs'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');
  api.use(['templating', 'blaze', 'underscore'], 'client');
  api.use('ecmascript@0.7.2');
  api.addFiles([
    'index.js'
  ], 'client');
});
