module.exports = {
    getHeaders: function () {
        return {
            'Authorization': 'Bearer token',
            'Content-Type': 'application/json'
        }
    },
    getServer: function () {
        return 'https://site/rest';
    },
    getMemcachedServer: function () {
        return '127.0.0.1:11211';
    }
};
