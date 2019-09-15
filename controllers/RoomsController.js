const WebSocket = require('ws');
const AgentsForMonitor = require('./../rooms/AgentsForMonitor');
const CallStatisticForMonitor = require('./../rooms/CallStatisticForMonitor');
const CallQueueForMonitor = require('./../rooms/CallQueueForMonitor');

module.exports = {
    /**
     * run rooms for CLIENTS
     * @param CLIENTS
     */
    run: function (CLIENTS) {

        let getAgentsForMonitor= setInterval(function check() {
            let inRoom = CLIENTS.filter(function (client) {
                if (client.data !== undefined) {
                    return client.data.rooms.indexOf('getAgentsForMonitor') > -1;
                }
                return false;
            });
            if (inRoom.length > 0) {
                let getData = AgentsForMonitor.getData();
                getData.then(function (result) {
                    console.log('getAgentsForMonitor: ' + inRoom.length);
                    inRoom.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(result);
                        }
                    });
                });
            }
        }, 3000);

        let getCallQueueForMonitor= setInterval(function check() {
            let inRoom = CLIENTS.filter(function (client) {
                if (client.data !== undefined) {
                    return client.data.rooms.indexOf('getCallQueueForMonitor') > -1;
                }
                return false;
            });
            if (inRoom.length > 0) {
                let getData = CallQueueForMonitor.getData();
                getData.then(function (result) {
                    console.log('getCallQueueForMonitor: ' + inRoom.length);
                    inRoom.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(result);
                        }
                    });
                });
            }
        }, 3000);

        let getCallStatisticForMonitor= setInterval(function check() {
            let inRoom = CLIENTS.filter(function (client) {
                if (client.data !== undefined) {
                    return client.data.rooms.indexOf('getCallStatisticForMonitor') > -1;
                }
                return false;
            });
            if (inRoom.length > 0) {
                let getData = CallStatisticForMonitor.getData();
                getData.then(function (result) {
                    console.log('getCallStatisticForMonitor: ' + inRoom.length);
                    inRoom.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(result);
                        }
                    });
                });
            }
        }, 30000);

    }
};





