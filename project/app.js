module.exports = function (app) {

    require("./services/findMusicFingerPrint")(app);
    require("./services/music.service.server")(app);
    require("./services/email.service.server")(app);
   // require("./services/quickstart");

    console.log("Application is started");
  //  console.log("Application is started");
}
