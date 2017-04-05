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


    app.post("/api/musicCompany/uploadSong",upload,uploadMusicAws);

    function uploadMusicAws(req, res) {
        aws.uploadMusicAws(req.file.buffer).then(
            function (song) {

                return;
            },
            function (err) {
                res.json(err);
                return;
            }

        );
    }

}
