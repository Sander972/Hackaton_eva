/**
 * Brocker
 * mqtt://broker.hivemq.com
 *
 * topics:
 *  to send message from dashboard to EVA
 *  omroneva/command/task
 *
 *  to send message from EVA to dashboard
 *  omroneva/status
 *
 */

var mqtt = require('mqtt')
var config = require('../config/mqtt')
// TODO var telnetClient = require('./telnet');

var defaultTopic = 'omroneva'
var client = mqtt.connect(config.cs)

// Subsribe to topics
client.on('connect', () => {
    // broker.hivemq.com/omroneva/command
    client.subscribe(`${defaultTopic}/command/task`, (err) => { if (err) error(err); })
})

// On message receive
client.on('message', (topic, message) => {

    // broker.hivemq.com/omroneva/command/qp
    if (topic == `${defaultTopic}/command/task`) {

        var command = JSON.parse(message);
        console.log(command);

        switch (command.jobType) {
            case 'pickup':
                pickup(command)
                console.log('do pickup');
                break;
            case 'dropoff':
                dropoff(command)
                console.log('do dropoff');
                break;
        }
    }
})

client.on('error', (error) => {
    console.log(error);
    client.end();
    process.exit(1);
})

// Provide function to send data from robot to dashboard
function sendStatus(data) {

    // broker.hivemq.com/omroneva/status
    client.publish(`${defaultTopic}/status`, data)
}

function error(err) { console.log(err); }

function pickup(cmd) {
    telnetClient.sendCommandToEva(cmd); //TODO
}

function dropoff(cmd) {
    telnetClient.sendQueuePicker(cmd); //TODO
}

module.exports = { sendStatus }