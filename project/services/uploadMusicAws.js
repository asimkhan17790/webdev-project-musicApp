/**
 * Created by sumitbhanwala on 4/4/17.
 */

module.exports = function (app , listOfModel) {
    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    var multer = require('multer');
    var aws  = require ("../apis/aws.js")();
    var storage = multer.memoryStorage();
    var upload = multer({
        storage: storage
    }).single('file');

    var UserModel = listOfModel.UserModel ;
    var albumModel = listOfModel.albumModel ;
    var playListModel = listOfModel.playListModel;
    var songModel = listOfModel.songModel;

    app.post("/api/musicCompany/uploadSong",upload,uploadMusicAws);
    function uploadMusicAws(req, res) {
        var keyName = req.body.userId + Date.now() + ".mp3";
        var albumId = req.body.albumId ;
        aws.uploadMusicAws(req.file.buffer , keyName)
            .then(function (song) {
               var url = "https://s3-us-west-2.amazonaws.com/testbucketsumittest/" + keyName ;
               var newsong = {
                   songURL : url,
                   title : req.body.title ,
                   artist : req.body.artist,
                   genre : req.body.genre
               }
                songModel.createSong(newsong,albumId)
                   .then(function (newsong){
                       return albumModel.addSong(newsong ,albumId);
                   }).then(function (updatedAlbum) {
                       res.json(updatedAlbum);
                       return;
                }, function (err) {
                    res.json(err);
                    return;
                });
            },
            function (err) {
                res.json(err);
                return;
            }

        );
    }

}
