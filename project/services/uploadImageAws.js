/**
 * Created by sumitbhanwala on 4/10/17.
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

    app.post("/api/image/uploadImage",upload,uploadImageAws);

    function uploadImageAws(req, res) {
        var fileName = req.file.originalname ;
        var format = fileName.split(".")[1];
        var keyName = req.body.userId + Date.now() + "."+ format;
        aws.uploadImageAws(req.file.buffer , keyName)
            .then(function (image) {
                    var url = "https://s3-us-west-2.amazonaws.com/musicappimage/" + keyName ;
                    var data = {
                        URL : url
                    }
                    console.log(data);
                    res.send(data);
                },
                function (err) {
                    res.json(err);
                    return;
                }
            );
    }

}
