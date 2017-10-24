const chokidar = require('chokidar');
const fs = require('fs');
const Path = require('path');
const HsParser = require('hearthstone-log-parser');

let watcher = null;
let showInLogFlag = false;

let log;

var currentLine;

function StartWatcher(path) {
  document.getElementById('start').disabled = true;
  document.getElementById('messageLogger').innerHTML = 'Scanning the path, please wait ...';
  console.log('Watcher Started');

  watcher = chokidar.watch(path, {
    ignored: /[\/\\]\./,
    persistent: true,
  });

  log = {
    log: fs.readFileSync(path + '/Power.log').toString().split('\n')
  }

  let startingLine = log.length
  // console.log(log);
  // fs.readFileSync(path)
  // readLines(log);

  function onWatcherReady() {
    console.info('From here can you check for real changes, the initial scan has been completed.');
    showInLogFlag = true;
    document.getElementById('stop').style.display = 'block';
    document.getElementById('messageLogger').innerHTML = 'The path is now being watched';
  }

  watcher
    .on('add', (path) => {
      console.log('File', path, 'has been added');

      if (showInLogFlag) {
        addLog(`File added : ${  path}`, 'new');
      }
    })
    .on('addDir', (path) => {
      console.log('Directory', path, 'has been added');

      if (showInLogFlag) {
        addLog(`Folder added : ${  path}`, 'new');
      }
    })
    .on('change', (path) => {
      console.log('File', path, 'has been changed');

      log = {
        data: fs.readFileSync(path).toString().split('\n')
      }

      // if a line was previously set, slice at that line
      if (currentLine) {
        var logChanges = {
          data: log.data.slice(currentLine),
        }
      } else {
      // if no previous line provided, use starting line set in init
        var logChanges = {
          data: log.data.slice(startingLine),
        }
      }

      currentLine = log.data.length;

      logChanges.data.forEach(line => {
        // if a card was played
        if (line.includes('PowerTaskList')) {
          // var regex = new RegExp('(?=id=(?<id>(\d+)))(?=name=(?<name>(\w+)))?(?=zone=(?<zone>(\w+)))?(?=zonePos=(?<zonePos>(\d+)))?(?=cardId=(?<cardId>(\w+)))?(?=player=(?<player>(\d+)))?(?=type=(?<type>(\w+)))?")');
          // let entity = regex(line);
          console.log(line);
        }

        if (line.includes('BlockType=PLAY') && line.includes('GameState') && !line.includes('UNKNOWN ENTITY')) {
        // if (line.includes('BlockType=PLAY')) {
          // console.log(line);

          let entity = line.split(/(entityName=)/)[2];
          let entityName = entity.split(' id=')[0];

          addLog(`Card Played: ${entityName}`, 'change');

          // console.log(entityName);
        } else if (line.includes('player=1')) {

          console.log(line);

          // console.log('Opponent Played:')
        }
      })

      // console.log(logChanges);

      

      console.log(log);

      if (showInLogFlag) {
        addLog(`Card Played: ${entityName}`, 'change');
      }
    })
    .on('unlink', (path) => {
      console.log('File', path, 'has been removed');

      if (showInLogFlag) {
        addLog(`A file was deleted : ${  path}`, 'delete');
      }
    })
    .on('unlinkDir', (path) => {
      console.log('Directory', path, 'has been removed');

      if (showInLogFlag) {
        addLog(`A folder was deleted : ${  path}`, 'delete');
      }
    })
    .on('error', (error) => {
      console.log('Error happened', error);

      if (showInLogFlag) {
        addLog('An error ocurred: ', 'delete');
        console.log(error);
      }
    })
    .on('ready', onWatcherReady)
    .on('raw', (event, path, details) => {

      console.log('File Changed');

      let filePath = Path.join(details.watchedPath, '/', path)

      // console.log(filePath);

      log = {
        data: fs.readFileSync(filePath).toString().split('\n')
      }

      // if a line was previously set, slice at that line
      if (currentLine) {
        var logChanges = {
          data: log.data.slice(currentLine),
        }
      } else {
      // if no previous line provided, use starting line set in init
        var logChanges = {
          data: log.data.slice(startingLine),
        }
      }

      console.log(filePath);

      currentLine = log.data.length;
      
      
      logChanges.data.forEach(line => {
         // if a card was played
         if (line.includes('PowerTaskList')) {
      //   //   // var regex = new RegExp('(?=id=(?<id>(\d+)))(?=name=(?<name>(\w+)))?(?=zone=(?<zone>(\w+)))?(?=zonePos=(?<zonePos>(\d+)))?(?=cardId=(?<cardId>(\w+)))?(?=player=(?<player>(\d+)))?(?=type=(?<type>(\w+)))?")');
      //   //   // let entity = regex(line);
      //   //   var zoneChange = /^\[Zone\] ZoneChangeList.ProcessChanges\(\) - id=\d+ local=.+ \[name=(.+) id=(\d+) zone=.+ zonePos=\d+ cardId=(.+) player=(\d)\] zone from ?(FRIENDLY|OPPOSING)? ?(.*)? -> ?(FRIENDLY|OPPOSING)? ?(.*)?$/;
      //   //   var group = zoneChange.exec(line);
          
      //   //   if (group != null) {
      //   //     // console.log(group);
      //   //   }

      //   //   if (line.includes('PowerTaskList')) {
      //   //     console.log(line);
      //   //   }
            console.log(line);
          }

      //   if (line.includes('BlockType=PLAY') && line.includes('GameState')) {
      //   // if (line.includes('BlockType=PLAY')) {
      //     console.log(line);

      //   //   let entity = line.split(/(entityName=)/)[2];
      //   //   let entityName = entity.split(' id=')[0];

      //   //   addLog(`Card Played: ${entityName}`, 'change');

      //   //   // console.log(entityName);
      //   // } else if (line.includes('player=1')) {

      //   //   console.log(line);

      //   //   // console.log('Opponent Played:')
      //   }
      })



      // logChanges.data.forEach(line => {
      //   console.log(line);
      // });

    });
}

document.getElementById('start').addEventListener('click', (e) => {
  const { dialog } = require('electron').remote;
  dialog.showOpenDialog({
            properties: ['openDirectory'],
          }, (path) => {
            if (path) {
                // console.log(process.env.HOME);
                // console.log(path);
                let absolutePath = Path.resolve(process.env.HOME, '../../', 'Program Files (x86)', 'Hearthstone' );
                console.log(absolutePath);
                parser = new HsParser();

                parser.on('action', function (data) {
                    console.log(data);
                });

                parser.on('match-start', function (data) {
                    console.log(data);
                });

                parser.on('match-over', function (data) {
                    console.log(data);
                    process.exit();
                });
                StartWatcher(path[0]);
              } else {
                console.log('No path selected');
              }
          });
}, false);

document.getElementById('stop').addEventListener('click', (e) => {
  if (!watcher) {
             console.log('You need to start first the watcher');
           } else {
             watcher.close();
             document.getElementById('start').disabled = false;
             showInLogFlag = false;
             document.getElementById('messageLogger').innerHTML = 'Nothing is being watched';
           }
}, false);

function resetLog() {
  return document.getElementById('log-container').innerHTML = '';
}

function addLog(message, type) {
  const el = document.getElementById('log-container');
  const newItem = document.createElement('LI');       // Create a <li> node
  const textnode = document.createTextNode(message);  // Create a text node
  if (type == 'delete') {
             newItem.style.color = 'red';
           } else if (type == 'change') {
               newItem.style.color = 'blue';
             } else {
               newItem.style.color = 'green';
             }

  newItem.appendChild(textnode);                    // Append the text to <li>
  el.appendChild(newItem);
}
