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
        deleteplayList : deleteplayList,
        findUserById: findUserById,
        updateUser : updateUser,
        findFollowersById:findFollowersById,
        findFollowingById : findFollowingById ,
        followUser : followUser ,
        findIsFollowing : findIsFollowing,
        unfollowUser : unfollowUser,
        followingUser : followingUser,
        unfollowingUser : unfollowingUser,
        searchUsers : searchUsers
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);
    return api;

    function searchUsers (searchArray) {
        var q1 =  q.defer();
        UserModel.find({ $text: { $search: searchArray }}, {password : 0},function (err ,users) {
            if(err)
                q1.reject();
            else
                q1.resolve(users);
        });
        return q1.promise;
    }

    // userID1 will be the one following the userId2

    function unfollowingUser(userId2 , userId1) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId2}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                User.following.pull(userId1);
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
    function followingUser(userId2 , userId1) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId2}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                User.following.push(userId1);
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


    // checking if the userId2 is following the userId1
    // strategy is to find all the followers of the userId1
    // and check if the userId2 is present in that list or not.
    function findIsFollowing(userId1 ,userId2) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId1}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                var followers = User.followers ;
                var status = {
                    isPresent : ""
                }
                if(followers.indexOf(userId2) > -1)
                    status.isPresent = true;
                else
                    status.isPresent = false;
                q1.resolve(status);
            }
        });
        return q1.promise;

    }

    function unfollowUser(userId1 , userId2) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId1}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                User.followers.pull(userId2);
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

    function followUser(userId1 , userId2) {
        var q1 =  q.defer();
        UserModel.findOne({_id:userId1}, function(err, User) {
            if (err){
                q1.reject();

            }
            else {
                User.followers.push(userId2);
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


    function findFollowersById(userId)
    {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('followers')
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


    function findFollowingById(userId)
    {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('following')
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

    function updateUser(userId , user) {
        var q1 =  q.defer() ;
        UserModel.findOne({_id:userId} , function (err , retuser) {
            if(err)
                q1.reject();
            else
            {
                retuser.username = user.username;
                retuser.firstName = user.firstName;
                retuser.lastName = user.lastName;
                retuser.email = user.email;
                retuser.phone = user.phone;
                retuser.imageURL = user.imageURL;
                retuser.save(function (err, updatedUser) {
                    if (err) {
                        q1.reject(err);
                    }
                    else {
                        q1.resolve(updatedUser);
                    }
                });
            }
        });
        return q1.promise ;
    }
    function findUserById(userId) {
        var q1 = q.defer();
        UserModel.findOne({_id:userId} ,function (err ,User) {
            if(err)
                q1.reject();
            else if(User)
                q1.resolve(User);
        });
        return q1.promise;
    }

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