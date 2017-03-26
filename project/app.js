module.exports = function (app) {

    require("./services/findMusicFingerPrint")(app);

    console.log("Application is started");
}
