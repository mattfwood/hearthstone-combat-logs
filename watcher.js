const fs = require('fs');

var watch = require('watch');

let log;
let currentLine;
var startingLine;

document.getElementById('start').addEventListener('click', (e) => {
    const { dialog } = require('electron').remote;
    dialog.showOpenDialog({
              properties: ['openDirectory'],
            }, (path) => {
              if (path) {
                console.log(path[0]);

                log = fs.readFileSync(path[0] + '/output_log.txt').toString().split('\n');
                
                console.log(log);

                startingLine = log.length;

                watch.createMonitor(path[0], function (monitor) {
                  // monitor.files['.zshrc'] // Stat object for my zshrc.
                  monitor.on("created", function (f, stat) {
                    // Handle new files
                    console.log('File Created');
                  })
                  monitor.on("changed", function (f, curr, prev) {
                    // Handle file changes

                    // console.log(f);

                    log = fs.readFileSync(f).toString().split('\n');

                    if (currentLine) {
                      logChanges = log.slice(currentLine);
                    } else {
                      logChanges = log.slice(startingLine);
                    }

                    currentLine = log.length;

                    // console.log(logChanges);

                    logChanges.forEach(line => {
                      if (line.includes('BlockType=PLAY') && line.includes('GameState')) {
                        console.log(line);
                      };
                    }); 

                    // console.log(f);
                    // console.log('File Changed');
                    // console.log(f);
                    // console.log(curr);
                  })
                  monitor.on("removed", function (f, stat) {
                    // Handle removed files
                    console.log('File Removed');
                  })
                })
                
                } else {
                  console.log('No path selected');
                }
            });
  }, false);