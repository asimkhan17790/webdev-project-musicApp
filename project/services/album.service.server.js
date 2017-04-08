/**
 * Created by sumitbhanwala on 4/6/17.
 */

module.exports = function (app ,listOfModel) {

    app.post("/api/album" ,createalbum);
    app.get("/api/user/album/song/:albumId",findAllSongsForAlbum);
    app.delete("/api/album/:aid" ,deleteAlbum);

    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;
    var songModel = listOfModel.songModel;
    function deleteAlbum(req ,res) {
        console.log("inside the server side");
        var albumId = req.params.aid;
        albumModel.deleteAlbum(albumId)
            .then(function (album) {
                var songs = album.songs ;
                var userId = album.albumOwner;
                songModel.deleteAllSongs(songs)
                    .then(function (songs) {
                        userModel.deleteAlbum(userId ,albumId)
                            .then(function (user) {
                                res.send(user);
                            },function (err) {
                                res.send(err);
                            });
                    },function (err) {
                        res.send(err);
                    });
            },function (err) {
                // maybe make the error more descriptive
               res.send(200);
            });
    }

    function createalbum(req,res) {
        var album = req.body;
        albumModel.createAlbum(album)
            .then(function(album) {
               return userModel.addalbum(album);
            })
            .then(function (album) {
                res.send(album);
            },function (err) {
                res.send(err);
            })
    }



    function findAllSongsForAlbum(req ,res) {
        var albumId = req.params.albumId;
        albumModel
            .findAllSongs(albumId)
            .then(function(album) {
                res.send(album);
            }, function (error) {
                res.sendStatus(500).send(error);
            })

    }

}