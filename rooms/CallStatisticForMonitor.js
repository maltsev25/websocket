const rp = require('request-promise');
const config = require('../config');

module.exports = {

    getData:function() {
        console.log('room CallStatisticForMonitor request');

        return new Promise(function(resolve, reject){
            rp({
                url: config.getServer()+'/v1/ivr/call/getCallStatisticForMonitor',
                method: 'GET',
                headers: config.getHeaders()
            })
                .then(function (body) {
                    resolve('{"getCallStatisticForMonitor":'+body+'}');
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    },
};

