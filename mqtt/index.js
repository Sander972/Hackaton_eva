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
var telnetClient = require('../telnet');

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
                pickup(command); console.log('do pickup');
                break;
            case 'dropoff':
                dropoff(command); console.log('do dropoff');
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
module.exports.sendUpdate = function (data) {
    if (data.includes('QueueUpdate:')) {
        var response = data.split(' ');
        var obj = {
            jobID: response[1],
            priority: response[3],
            status: response[4],
            goalID: response[6] + ' ' + response[7],
            dateStart: response[9],
            timeStart: response[10],
            dateEnd: response[11] == 'None' ? response[11] : null,
            timeEnd: response[12] == 'None' ? response[12] : null,
        }
        client.publish(`${defaultTopic}/status/lasttask`, obj)
        console.log(obj);
    }
    
    // Status: Arrived at B

    if (data.includes('Temperature:')) {
        var response = data.split(' ');
        var obj = {
            type: 'temp',
            value: response[1]
        }
        client.publish(`${defaultTopic}/status`, obj)
        console.log(obj);
    }

    if (data.includes('StateOfCharge:')) {
        var response = data.split(' ');
        var obj = {
            type: 'battery',
            value: response[1]
        }
        client.publish(`${defaultTopic}/status`, obj)
        console.log(obj);
    }

    // broker.hivemq.com/omroneva/status
    client.publish(`${defaultTopic}/status`, obj)

}

function error(err) { console.log(err); }

function pickup(json) {
    var cmd = `qp ${json.goalID} ${json.priority}`
    telnetClient.sendCommandToEva(cmd);
}

function dropoff(cmd) {
    telnetClient.sendCommandToEva(cmd);
}


