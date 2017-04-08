/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {
    var api = {
        createSong : createSong ,
        deleteAllSongs : deleteAllSongs ,
        deleteSong : deleteSong
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var songSchema = require('./song.schema.server.js')();
    var songModel = mongoose.model('songModel', songSchema);
    return api;

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

    function createSong (newsong) {
        var q1 = q.defer();
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