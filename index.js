const fs = require('fs');
let privateKey  = fs.readFileSync('./sslcert/private.pem', 'utf8');
let certificate = fs.readFileSync('./sslcert/public.pem', 'utf8');
let credentials = {key: privateKey, cert: certificate};
const https = require('https');

const WebSocket = require('ws');

const AuthController = require('./controllers/AuthController');
const RoomsController = require('./controllers/RoomsController');

const httpsServer = https.createServer(credentials);
httpsServer.listen(8080);

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    server: httpsServer
});
CLIENTS=[];

function noop() {}

function heartbeat() {
    this.isAlive = true;
}

/**
 * remove client
 * @param ws
 */
function removeClient(ws) {
    let index = CLIENTS.indexOf(ws);
    console.log('соединение ' + index + ' закрыто ' + ws._socket.remoteAddress + ":" + ws._socket.remotePort);
    if(index > -1) {
        CLIENTS.splice(index, 1);
    }
}

/**
 * set client data (auth_token, rooms)
 * @param ws
 * @param data
 */
function setDataClient(ws, data) {
    let index = CLIENTS.indexOf(ws);
    if(index > -1) {
        CLIENTS[index].data = data;
    }
}

/**
 * ping-pong
 * @type {number}
 */
const pingPong = setInterval(function ping() {
    CLIENTS.forEach(function each(ws) {
        if (ws.isAlive === false) {
            removeClient(ws);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 5000);

wss.on('connection', function(ws) {
    CLIENTS.push(ws);
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    console.log("новое соединение " +  ws._socket.remoteAddress + ":" + ws._socket.remotePort);

    ws.on('message', function incoming(data) {
        console.log("сообщение " + ws._socket.remoteAddress + ":" + ws._socket.remotePort + " содержание: " + data);
        let jsonObj = JSON.parse(data);
        if(jsonObj.auth_token !== undefined) {
            let authResult = AuthController.checkAuthCache(jsonObj.auth_token);
            authResult.then(function (result) {
                if (result === true) {
                    console.log('authorised');
                    setDataClient(ws, jsonObj);
                }
            });
        }
        // CLIENTS.forEach(function each(client) {
        //         if (client.readyState === WebSocket.OPEN) {
        //             client.send(data);
        //         }
        //     });
    });

    ws.on('close', function() {
        removeClient(ws);
    });

});

RoomsController.run(CLIENTS);

console.log('WebSocket server start');