var Telnet = require('telnet-client')
var connection = new Telnet()
var cmd = 'status';

let params = {
    host: '192.168.100.2',
    port: 7171,
    shellPrompt: '',
    timeout: 1500,
    passwordPrompt: 'Enter password:',
    password: 'adept'
}
 
connection.on('ready', function(prompt) {
  connection.exec(cmd, function(err, response) {
    console.log(response)
  })
});
 
connection.on('timeout', function() {
  console.log('socket timeout!')
  connection.end()
});
 
connection.on('close', function() {
  console.log('connection closed')
});

connection.on('failedlogin',function(msg) {
    console.log("Login failed !",msg);
});
 
connection.connect(params)