/**
 * Created by sumitbhanwala on 4/6/17.
 */

module.exports = function (app ,listOfModel) {

    app.post("/api/album" ,createalbum);

    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;

    // add this album to the user model also
    // so as to refer to this particular album
    function createalbum(req,res) {
        var album = req.body;
        albumModel
            .createAlbum(album)
            .then(function(album) {
                res.send(album);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

}