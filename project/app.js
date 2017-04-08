module.exports = function (app) {

    var modelList = require('./modal/models.server.js')();
    // send this model list later to the below services so that
    // the data they bring will be reflected in the database and populated
    // sample file will be require("./services/findMusicFingerPrint")(app, modelList);
    require("./services/findMusicFingerPrint")(app);
    require("./services/music.service.server")(app);
    require("./services/email.service.server")(app);
    require("./services/eventbrite.service.server")(app);
    require("./services/user.service.server")(app,modelList);
    require("./services/album.service.server")(app,modelList);
    require("./services/uploadMusicAws")(app,modelList);
   // require("./services/quickstart");

    console.log("Application is started");
}
