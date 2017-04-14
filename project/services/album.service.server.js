/**
 * Created by sumitbhanwala on 4/6/17.
 */

module.exports = function (app ,listOfModel) {

    app.post("/api/album" ,createalbum);
    app.get("/api/user/album/song/:albumId",findAllSongsForAlbum);
    app.delete("/api/album/:aid" ,deleteAlbum);
    app.delete("/api/user/album/song/:albumId/:songId",deleteSongFromAlbum);

    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;
    var songModel = listOfModel.songModel;


    function deleteSongFromAlbum(req , res) {
        var albumId = req.params.albumId;
        var songId = req.params.songId ;
        var response = {};
        albumModel
            .deleteSong(songId ,albumId)
            .then(function(album) {
                response.status = "OK";
                response.data = album;
                res.send(response);
            }, function (error) {
                response.status="KO";
                response.description="Some error occurred while deletion of song!!";
                res.json(response);
            });
    }


    // possibly some bug in the below code as we are deleting the songs from
    // the song model which we shouldnt according to our functionality..
    function deleteAlbum(req ,res) {
        var response = {};
        var albumId = req.params.aid;
        albumModel.deleteAlbum(albumId)
            .then(function (album) {
                var userId = album.albumOwner;
                userModel
                    .deleteAlbum(userId ,albumId)
                            .then(function (user) {
                                response.status ="OK";
                                response.data = user ;
                                res.send(response);
                            },function (err) {
                                response.status ="KO";
                                response.description = "Unable to delete the album";
                                res.send(response);
                            });
            },function (err) {
                response.status ="KO";
                response.description = "Unable to delete the album";
                res.send(response);
            });
    }

    function createalbum(req,res) {
        var album = req.body;
        var response = {};
        albumModel.createAlbum(album)
            .then(function(album) {
               return userModel.addalbum(album);
            })
            .then(function (updatedUser) {
                if (updatedUser) {
                    response.status ="OK";
                }
                else {
                    response.status ="KO";
                }
                res.json(response);
            },function (err) {
                response.status ="KO";
                res.json(response);
            })
    }

    function findAllSongsForAlbum(req ,res) {
        var response = {};
        var albumId = req.params.albumId;
        albumModel
            .findAllSongs(albumId)
            .then(function(album) {
                response.status = "OK";
                response.data = album;
                res.send(response);
            }, function (error) {
                response.status="KO";
                response.description="Some error occurred!!";
                res.json(response);
            })

    }

}