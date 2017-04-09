/**
 * Created by sumitbhanwala on 4/4/17.
 */

/**
 * Created by sumitbhanwala on 3/10/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
        createUser: createUser ,
        findUserByCredentials : findUserByCredentials,
        addalbum : addalbum,
        findAllAlbums  : findAllAlbums ,
        deleteAlbum : deleteAlbum,
        addplayList : addplayList,
        findAllplayLists : findAllplayLists,
        deleteplayList : deleteplayList
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);
    return api;

    function deleteplayList(userId , playListId) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                User.playList.pull(playListId);
                User.save(function (err, updatedUser) {
                    if (err) {
                        q1.reject();
                    }
                    else {
                        q1.resolve(updatedUser);
                    }
                });
            }
        });
        return q1.promise;
    }
    
    function deleteAlbum(userId , albumId) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                User.album.pull(albumId);
                User.save(function (err, updatedUser) {
                    if (err) {
                        q1.reject();
                    }
                    else {
                        q1.resolve(updatedUser);
                    }
                });
            }
        });
        return q1.promise;
    }

    function findUserByCredentials(userName , password) {
        var q1 =  q.defer() ;
        UserModel.findOne({username : userName ,password :password} , function (err , user) {
            if(err)
                q1.reject();
            else
                q1.resolve(user);
        });
        return q1.promise ;
    }

    function findAllAlbums(userId) {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('album')
            .exec(function (err, user) {
                if(user)
                {
                    q1.resolve(user);
                }
                else
                    q1.reject ;
            });

        return q1.promise;
    }

    function findAllplayLists(userId) {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('playList')
            .exec(function (err, user) {
                if(user)
                {
                    q1.resolve(user);
                }
                else
                    q1.reject ;
            });

        return q1.promise;
    }

    function createUser(user) {
        var q1 =  q.defer() ;
        UserModel.create(user ,function (err , user) {
            if(err){
                q1.reject();
            }
            else
            {
                q1.resolve(user);
            }
        });
        return q1.promise;
    }

    function addalbum( album) {
        var q1 =  q.defer();
        UserModel.findOne({_id:album.albumOwner}, function(err, user) {
            if (err){
                q1.reject(err);
            }
            else if (user){
                user.album.push(album._id);
                user.save(function (err, upAlbum) {
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

    function addplayList(playList) {
        var q1 =  q.defer();
        UserModel.findOne({_id:playList.playListOwner}, function(err, user) {
            if (err){
                q1.reject(err);
            }
            else if (user){
                user.playList.push(playList._id);
                user.save(function (err, upplayList) {
                    if (err) {
                        q1.reject();
                    }
                    else {
                        q1.resolve(upplayList);
                    }
                });
            }
        });
        return q1.promise;
    }
};