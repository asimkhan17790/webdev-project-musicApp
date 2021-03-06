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
        addSongtoPlaylist : addSongtoPlaylist,
        deleteSong :deleteSong ,
        deleteallplayLists : deleteallplayLists ,
        checkSongInPlayList : checkSongInPlayList
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var playListSchema = require('./playlist.schema.server.js')();
    var playListModel = mongoose.model('playListModel', playListSchema);
    return api;

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations

    function checkSongInPlayList(playListId, songId) {
        var q1 =  q.defer();
        playListModel.findOne({_id:playListId}, function(err, playList) {
            if (err){
                q1.reject(err);
            }
            else if (playList){
                if (playList.songs && playList.songs.indexOf(songId) >=0) {
                    console.log('Song Exists');
                    q1.resolve();
                }
                else {

                    q1.reject();
                }
            }
        });
        return q1.promise;
    }
    function deleteallplayLists(playLists) {
        var q1 =  q.defer();
        playListModel.find({'_id': {'$in': playLists}}, function (err, playLists) {
            if (err) {
                q1.reject();
            }
            else
                q1.resolve(playLists);
        });
        return q1.promise;
    }


    function deleteSong(songId , playListId) {
        var deferred=q.defer();
        playListModel.update({_id: playListId},
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

    function addSongtoPlaylist(songId , playListId) {
        var q1 =  q.defer();
        playListModel.findOne({_id:playListId}, function(err, playList) {
            if (err){
                q1.reject(err);
            }
            else if (playList){
                if (playList.songs && playList.songs.indexOf(songId) >=0) {
                    console.log('Song already added');
                    q1.reject('KOO');

                }
                else {
                    playList.songs.push(songId);
                    playList.save(function (err, playList) {
                        if (err) {
                            q1.reject('Some Error Occurred');
                        }
                        else {
                            q1.resolve(playList);
                        }
                    });
                }
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