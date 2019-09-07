const rp = require('request-promise');
const config = require('../config');

module.exports = {

    getData:function() {
        console.log('room AgentsForMonitor request');

        return new Promise(function(resolve, reject){
            rp({
                url: config.getServer()+'/v1/ivr/agents/getAgentsForMonitor',
                method: 'GET',
                headers: config.getHeaders()
            })
                .then(function (body) {
                    resolve('{"getAgentsForMonitor":'+body+'}');
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    },
};

