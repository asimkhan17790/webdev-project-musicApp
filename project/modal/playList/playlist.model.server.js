/**
 * Created by sumitbhanwala on 4/5/17.
 */

module.exports = function () {

    // expsoing this particular api
    var api = {
        findplayListById : findplayListById ,
        createplayList : createplayList ,
       // findAllSongs : findAllSongs,
        deleteplayList : deleteplayList,
        addSongtoPlaylist : addSongtoPlaylist
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var playListSchema = require('./playlist.schema.server.js')();
    var playListModel = mongoose.model('playListModel', playListSchema);
    return api;

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations

    function addSongtoPlaylist(songId , playListId) {
        var q1 =  q.defer();
        playListModel.findOne({_id:playListId}, function(err, playList) {
            if (err){
                q1.reject(err);
            }
            else if (playList){
                playList.songs.push(songId);
                playList.save(function (err, playList) {
                    if (err) {
                        q1.reject();
                    }
                    else {
                        q1.resolve(playList);
                    }
                });
            }
        });
        return q1.promise;
    }

    function createplayList (newplayList) {
        var q1 =  q.defer();
        playListModel.create(newplayList , function(err, newplayList) {
            if (err){
                q1.reject(err);
            }
            else if (newplayList){
                q1.resolve(newplayList);
            }
        });
        return q1.promise;
    }

    function addSong() {

    }

    function findplayListById(playListId) {
        var q1 = q.defer();
        playListModel
            .findOne({ _id: playListId})
            .populate('songs')
            .exec(function (err, playList) {
                if(playList)
                {
                    q1.resolve(playList);
                }
                else
                    q1.reject(err) ;
            });
        return q1.promise;
    }

    function deleteplayList(playListId) {
        var q1 = q.defer();
        playListModel.findOneAndRemove({_id :playListId} ,function (err ,playList) {
            if(err)
                q1.reject();
            else if (playList)
                q1.resolve(playList);
        });
        return q1.promise ;

    }
};