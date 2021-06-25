const CronJob = require('cron').CronJob;
const spawn = require('child_process').spawn
const util = require('util');

const LogRecording = require('./logs/log');

// '0 0 * * *'     => Backup at 00:00 every day.
// '*/5 * * * * *' => Backup every 5 seconds.
module.export = new CronJob('*/5 * * * * *', () => {
    const date = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'})
    const YY_MM_DD = date.split(/(\s+)/)[0].replace('/', '_').replace('/', '_');
    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                    util.format("Backup Database at %s", date),
                    "\x1b[31mBackup\x1b[0m"
                );
    // execute shell command
    const mongoBackup = spawn('mongodump', [
        '--db=testdb',
        util.format('--archive=./backup/%s.gz', YY_MM_DD),
        '--gzip'
    ])
    mongoBackup.on('exit', (code, signal) => {
        if(code) 
            console.log('[Backup process exited with code]', code);
        else if (signal)
            console.error('[Backup process was killed with singal]', signal);
        else
            console.log(util.format('[Successfully Backedup the Database] : %s', date))
    })
}).start();
