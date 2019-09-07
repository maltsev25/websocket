const rp = require('request-promise');
const config = require('../config');

module.exports = {

    checkAuth:function(auth_token) {
        console.log('checkAuth request');

        return new Promise(function(resolve, reject){
            rp({
                url: config.getServer()+'/v1/auth/checkToken',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+auth_token,
                    'Content-Type': 'application/json'
                }
            })
                .then(function (body) {
                    resolve(body);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    },
};

