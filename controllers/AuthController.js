const Memcached = require('memcached');
const CheckAuth = require('./../rooms/CheckAuth');
const config = require('./../config');
let memcached = new Memcached(config.getMemcachedServer());

module.exports = {

    checkAuthCache:function(auth_token) {

        console.log('checkAuthCache');

        return new Promise(function(resolve, reject){
            memcached.get(auth_token, function (err, data) {
                if (data !== 'true') {
                    let checkAuth = CheckAuth.checkAuth(auth_token);
                    checkAuth.then(function (result) {
                        if (JSON.parse(result).status === 200) {
                            memcached.set(auth_token, 'true', 43200, function( err, result ){
                                if( err ) console.error( err );
                                resolve(result);
                            });
                        }
                    });
                } else {
                    resolve(data==='true');
                }
            });
        });

    },
};

