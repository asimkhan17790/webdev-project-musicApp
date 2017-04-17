module.exports = function () {
    var api = {
        createSong : createSong ,
        deleteAllSongs : deleteAllSongs ,
        deleteSongs : deleteSong,
        searchSongs: searchSongs,
        findSongById:findSongById,
        findSongBySpotifyId :findSongBySpotifyId
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var songSchema = require('./song.schema.server.js')();
    var songModel = mongoose.model('songModel', songSchema);
    return api;

    function searchSongs (searchArray) {
        var q1 =  q.defer();
        songModel.find(
            { $text:
                { $search: searchArray}},
            function (err ,songs) {
                if(err)
                    q1.reject();
                else
                    q1.resolve(songs);
        });
        return q1.promise;
    }
    function findSongById(songid) {
        var q1 = q.defer();
        songModel.findOne({_id:songid})
            .populate('album',{albumname : 1})
            .exec(function (err ,song) {
                if(err)
                    q1.reject(err);
                else if(song)
                    q1.resolve(song);
            });

        return q1.promise;

    }
    function findSongBySpotifyId(spotifyId) {
        var q1 = q.defer();
        songModel.findOne({spotifyID : spotifyId}, function (err ,song) {
            if(err)
                q1.reject(null);
            else if(song)
                q1.resolve(song);
            else {
                q1.resolve(null);
            }
        });
        return q1.promise;

    }

    function deleteSong(songid) {
        var q1 = q.defer();
        songModel.findOneAndRemove({'_id' :songid} ,function (err,song) {
            if(err)
                q1.reject();
            else
                q1.resolve(song);
        });

        return q1.promise();
    }

    function deleteAllSongs (songs) {
        console.log(songs);
        var q1 = q.defer();
        songModel.remove({'_id': {'$in': songs}}, function (err, result) {
            if (err) {
                q1.reject();
            }
            else {
                q1.resolve(result);
            }
        });
        return q1.promise;

    }

    function createSong (newsong,albumId) {
        var q1 = q.defer();
        newsong.album = albumId;
        songModel.create(newsong, function (err, newsong) {
            if (err) {
                q1.reject();
            }
            else {
                q1.resolve(newsong);
            }
        });
        return q1.promise;
    }



};