
/**
 * Created by sumitbhanwala on 3/10/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
        addSong : addSong ,
        createAlbum : createAlbum ,
        findAllSongs : findAllSongs,
        deleteAlbum : deleteAlbum ,
        deleteSong : deleteSong
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var albumSchema = require('./album.schema.server.js')();
    var albumModel = mongoose.model('albumModel', albumSchema);
    return api;

    function deleteAlbum(albumId) {
        var q1 = q.defer();
        albumModel.findOneAndRemove({_id : albumId} , function (err , album) {
            if(err)
                q1.reject();
            else
                q1.resolve(album);
        });
        return q1.promise ;
    }


    function findAllSongs (albumId) {
        var q1 = q.defer();
        albumModel
            .findOne({ _id: albumId })
            .populate('songs')
            .exec(function (err, album) {
                if(album)
                {
                    q1.resolve(album);
                }
                else
                    q1.reject ;
            });
        return q1.promise;
    }

    function deleteSong(songId ,albumId) {
        var deferred=q.defer();
        albumModel.update({_id: albumId},
            {$pull: {songs: songId}},
            function (err, result) {
                if (err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    }
    
    function addSong(newSong , albumId) {
        var q1 =  q.defer();
        albumModel.findOne({_id:albumId}, function(err, album) {
            if (err){
                q1.reject(err);
            }
            else if (album){
                album.songs.push(newSong._id);
                album.save(function (err, upAlbum) {
                    if (err) {
                        q1.reject();
                    }
                    else {
                        q1.resolve(upAlbum);
                    }
                });
            }
        });
        return q1.promise;
    }

    function createAlbum (newAlbum ) {
        var q1 =  q.defer();
        albumModel.create( newAlbum , function(err, newAlbum) {
            if (err){
                q1.reject(err);
            }
            else if (newAlbum){
                q1.resolve(newAlbum);
            }
        });
        return q1.promise;
    }

};