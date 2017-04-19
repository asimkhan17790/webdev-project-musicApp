/**
 * Created by sumitbhanwala on 4/9/17.
 */
module.exports = function (app ,listOfModel) {


    app.post("/api/playList" ,createplayList);
    app.get("/api/user/playList/song/:pid",findPlayListById);
    app.delete("/api/playList/:pid" ,deleteplayList);
    app.get("/api/playList/new/:songid/:pid" ,addSongToPlayList);
    app.delete("/api/user/playlist/song/:playListId/:songId" ,deleteSongFromPlayList);
    app.post("/api/playList/createNewSong/:playlistId" ,createSongFromSpotify);
    app.post("/api/playList/createSongInFavorite/:playlistId" ,createSonginFavorite);
    app.get("/api/playList/songpresent/:playlistId/:songId" ,songExistsInPlayList);
    app.post("/api/playList/createSong/" ,createSong);


    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;
    var songModel = listOfModel.songModel;
    var playListModel = listOfModel.playListModel;


    function createSong(req, res) {
        var newSong = req.body;
        //var response = {};
        songModel.findSongBySpotifyId(newSong.spotifyID).
            then(function (found) {
                if (found) {
                    res.json(found);
                    return;
                }
                else {
                    return songModel.createSong(newSong);
                }

            }).then (function (createdSong) {
                res.json(createdSong);
                 },
                function (err) {
                    res.json(null);
                });

    }


    function songExistsInPlayList (req, res) {

        var response = {};
        var playListId = req.params.playlistId;
        var songId = req.params.songId;
        playListModel
            .checkSongInPlayList(playListId, songId)
            .then(function () {
                response.status = "YES";
                res.send(response);
            },function () {
                response.status="NO";
                res.json(response);
            });
    }
    function createSonginFavorite (req, res) {

        var newSong = req.body;
        var playlistId = req.params.playlistId;
        var response = {};
        songModel.createSong(newSong)
            .then(function (newSongCreated){
                return playListModel.addSongtoPlaylist(newSongCreated._id ,playlistId);
            }).then(function (updatedPlayList) {

            if (updatedPlayList) {
                response.status = 'OK';
                response.description = 'Song Successfully Added..';
                res.json(response);
            }

            else {
                response.status = 'KO';
                response.description = 'Some Error Occurred!!';
                res.json(response);
                return;
            }

            return;
        }, function (err) {
            if (error==='KOO') {
                response.status="KO";
                response.description="Song is already present in selected playlist!!";
                res.json(response);
                return;
            }else {
                response.status="KO";
                response.description="Some error occurred while addition of song!!";
                res.json(response);
            }
        });
    }

    function createSongFromSpotify(req, res) {

        var newSong = req.body;
        var playlistId = req.params.playlistId;
        var response = {};
        songModel.createSong(newSong)
            .then(function (newSongCreated){
                return playListModel.addSongtoPlaylist(newSongCreated._id ,playlistId);
            }).then(function (updatedPlayList) {

                if (updatedPlayList) {
                    response.status = 'OK';
                    response.description = 'Song Successfully Added..';
                    res.json(response);
                }
                else {
                    response.status = 'KO';
                    response.description = 'Some Error Occurred!!';
                    res.json(response);
                    return;
                }

            return;
        }, function (err) {
            if (err==='KOO') {
                response.status="KO";
                response.description="Song is already present in selected playlist!!";
                res.json(response);
                return;
            }else {
                response.status="KO";
                response.description="Some error occurred while addition of song!!";
                res.json(response);
                return;
            }
        });
    }


    function deleteSongFromPlayList (req ,res) {
        var playListId = req.params.playListId;
        var songId = req.params.songId ;
        var response = {};
        playListModel
            .deleteSong(songId ,playListId)
            .then(function(playList) {
                response.status = "OK";
                response.data = playList;
                res.send(response);
            }, function (error) {
                response.status="KO";
                response.description="Some error occurred while deletion of song!!";
                res.json(response);
            });
    }

    function addSongToPlayList(req ,res) {
        var songId = req.params.songid ;
        var pid  = req.params.pid;
        var response = {};
        playListModel.addSongtoPlaylist(songId ,pid)
            .then(function(playList) {
                response.status = "OK";
                response.data = playList;
                res.send(response);
            }, function (error) {
                if (error==='KOO') {
                    response.status="KO";
                    response.description="Song is already present in selected playlist!!";
                    res.json(response);
                    return;
                }else {
                    response.status="KO";
                    response.description="Some error occurred while addition of song!!";
                    res.json(response);
                }

            });
    }

    function createplayList(req,res) {
        var playList = req.body;
        var response = {};
        playListModel.createplayList(playList)
            .then(function(newplayList) {
                return userModel.addplayList(newplayList,null);
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

    function findPlayListById(req,res) {
        var response = {};
        var playListId = req.params.pid;
        playListModel
            .findplayListById(playListId)
            .then(function (playList) {
                response.status = "OK";
                response.data = playList;
                res.send(response);
            },function (err) {
                response.status="KO";
                response.description="Some error occurred!!";
                res.json(response);
            });
    }


    function deleteplayList(req,res) {
        console.log("inside the server side");
        var playListId = req.params.pid;
        playListModel.deleteplayList(playListId)
            .then(function (playList) {
                var userId = playList.playListOwner ;
                    userModel.deleteplayList(userId ,playListId)
                    .then(function (user) {
                        res.send(user);
                    },function (err) {
                        res.send(err);
                    });
            },function (err) {
              res.send(err);
            });
    }
}