module.exports = function (app) {


    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    var multer = require('multer');
    var arcCloud  = require ("../apis/acr.cloud.server")();

    var storage = multer.memoryStorage();

    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

   // arcCloud.findMusicFingerPrint(null) ;

    app.post("/api/findmusic/musicFingerPrint",upload,findMusicFingerPrint);

    var spotifyObject = require('../apis/spotify.api.server')();

    function findMusicFingerPrint(req, res) {
       arcCloud.findMusicFingerPrint(req.file.buffer).then(
           function (fingerPrintResultTrackId) {

               return spotifyObject.findtrackDetails(fingerPrintResultTrackId);

           }).then (
               function (musicData) {
                   res.json(musicData);
                   return;
               },
           function (err) {
               res.json(err);
               return;
           }
       );

    }

}
