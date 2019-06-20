var Telnet = require('telnet-client')
var connection = new Telnet()

var params = {
    host: '192.168.100.2',
    port: 7171,
    passwordPrompt: 'Enter password:',
    password: 'adept',
    shellPrompt: '',
    timeout: 3000,
    // removeEcho: 4
}

connection.connect(params)
    .then(
        (prompt) => {
            console.log(prompt);
            connection.exec('status')
                // .then(console.log)
                // .catch(console.log)
        },
        (error) => {
            console.log('promises reject:', error)
        })
    .catch(function (error) {
        console.log(error);
        // handle the throw (timeout)
    })

connection.on('data', (msg) => { console.log(msg); })