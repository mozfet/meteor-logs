/*jshint esversion: 6 */
// import { Log } from 'meteor-logs';
// import { Log } from 'meteor/mozfet:meteor-logs';

Log.log([], 'No tags.');

Log.log(['tag1', 'tag2'], 'Custom tags without colors.');

Log.info('Information without colors.');
Log.debug('Debug without colors.');
Log.warn('Warning without colors.');
try {Log.error('Error without colors.');} catch (e) {}

Log.color('error', 'white', 'red');
Log.color('warning', 'white', 'orange');
Log.color('information', 'black', 'green');
Log.color('debug', 'black', 'yellow');
Log.color('error', 'white', 'red');
Log.color('tag1', 'yellow', 'purple');
Log.color('tag2', 'purple');

Log.log(['tag1', 'tag2'], 'Custom tags with colors.');

Log.info('Information with colors.');
Log.debug('Debug with colors.');
Log.warn('Warning with colors.');
try {
  Log.error('Error with colors.');
}
catch (e) {}

Log.messageIndent(25);
Log.standardStreams(false);

Log.log([], 'No tags indented not using standard streams.');
Log.info('Information with colors indented not using standard streams.');
Log.debug('Debug with colors indented not using standard streams.');
Log.warn('Warning with colors indented not using standard streams.');
try {
  Log.error('Error with colors indented not using standard streams.');
}
catch (e) {}

Log.log(['debug', 'tag1', 'tag2'],
    'Debug with custom tags and colors.');
Log.log(['warning', 'tag1', 'tag2'],
    'Warning with custom tags and colors.');
Log.log(['information', 'tag1', 'tag2', ],
    'Information with custom tags and colors.');
try {Log.log(['error', 'tag1', 'tag2'],
    'Error with custom tags and colors.');} catch (e) {}

Log.log(['debug', 'tag1', 'tag2'],
    'Debug with custom tags and colors and data literal.', 42);
Log.log(['warning', 'tag1', 'tag2'],
    'Warning with custom tags and colors and data array.', [1,2,3,4]);
Log.log(['information', 'tag1', 'tag2', ],
    'Information with custom tags and colors and data object.', {foo: ['bar']});
try {
  Log.log(['error', 'tag1', 'tag2'],
    'Error with custom tags and colors and data.', [{foo: 'bar'}, ['foo'], 42]);
}
catch (e) {}
