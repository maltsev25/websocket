const rp = require('request-promise');
const config = require('../config');

module.exports = {

    getData:function() {
        console.log('room CallQueueForMonitor request');

        return new Promise(function(resolve, reject){
            rp({
                url: config.getServer()+'/v1/ivr/call/getCallQueueForMonitor',
                method: 'GET',
                headers: config.getHeaders()
            })
                .then(function (body) {
                    resolve('{"getCallQueueForMonitor":'+body+'}');
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    },
};

