var LogWatcher = require('hearthstone-log-watcher');
var logWatcher = new LogWatcher();
 
logWatcher.on('zone-change', function (data) {
  console.log(data.cardName + ' has moved from ' + data.fromTeam + ' ' + data.fromZone + ' to ' + data.toTeam + ' ' + data.toZone);
});
 
logWatcher.start();