var Telnet = require('telnet-client')
var connection = new Telnet()

var cmd= "status"
var params = {
  host: '192.168.100.2',
  port: 7171,
  passwordPrompt: 'Enter password:',
  password: 'adept',
  shellPrompt: '',
  timeout: 3000,
  sendTimeout: 3000,
  execTimeout: 3000
  // removeEcho: 4
}
var opt = {
  timeout: '10000'
}

/*
connection.connect(params)
  .then((prompt) => {
    console.log(prompt);
    connection.exec(cmd)
      .then(console.log)
        },
    (error) => {
      console.log('promises reject:', error)
    })
  .catch(function (error) {
    console.log(error);
    // handle the throw (timeout)
  })

*/

connection.connect(params)
  .then(console.log)

connection.on('ready', function(prompt) {
  connection.exec(cmd);
});

connection.on('data', (res) =>{
    console.log(res.toString())
  })


connection.on('timeout', function() {
  console.log('socket timeout!')
  connection.end();
});

connection.on('close', function() {
  console.log('connection closed');
});

