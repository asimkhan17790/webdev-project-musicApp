module.exports = function(app)
{
    var connectionString = 'mongodb://127.0.0.1:27017/musicApp';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;
    var d = require('domain').create();

    d.on('error', function(er) {
        console.log('Oh no, something wrong with DB' + er);
    });

    d.run(function() {
        mongoose.connect(connectionString);
    });
};