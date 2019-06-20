var Telnet = require('telnet-client')
var connection = new Telnet()

var mqtt = require('./mqtt/index')

var cmd = "status"
var params = {
  host: '192.168.100.2',
  port: 7171,
  passwordPrompt: 'Enter password:',
  password: 'adept',
  shellPrompt: 'Welcome to the server',
  timeout: 3000,
  sendTimeout: 3000,
  execTimeout: 3000
  // removeEcho: 4
}
var data;


connection.connect(params)
  .then((prompt) => {
    // console.log(prompt);

  },
    (error) => {
      console.log('promises reject:', error)
    })
  .catch(function (error) {
    console.log(error);
    // handle the throw (timeout)
  })





// connection.connect(params)
//   .then(console.log)

// connection.on('ready', function (prompt) {
//   connection.exec(cmd);
// });
/*
connection.on('data', (res) => {
  console.log(res.toString())
})

*/
// connection.on('timeout', function () {
//   console.log('socket timeout!')
//   connection.end();
// });

// connection.on('close', function () {
//   console.log('connection closed');
// });
connection.on('data', (res) => {
  //console.log(res.toString());
  mqtt.sendUpdate(res.toString())
})


function controlString(string){
  string.include("")
}


module.exports.sendCommandToEva = function(cmd) {

  connection.send(cmd, {}, (res) => { console.log(cmd + " ###") })
}

