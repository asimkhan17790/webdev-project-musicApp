
/**
 * Created by sumitbhanwala on 3/10/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
        addSong : addSong ,
        createAlbum : createAlbum
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var albumSchema = require('./album.schema.server.js')();
    var albumModel = mongoose.model('albumModel', albumSchema);
    return api;

    function addSong(newSong , albumId) {
        var q1 =  q.defer();
        albumModel.findOne({_id:albumId}, function(err, Website) {
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

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations


};