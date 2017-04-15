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
        searchUsers : searchUsers,
        searchNonAdminUsers : searchNonAdminUsers,
        findUserByEmail : findUserByEmail,
        deleteUser : deleteUser,
        deleteEventIdFromUser : deleteEventIdFromUser,
        addEventToUser : addEventToUser,
        findAllEventsOfUser : findAllEventsOfUser

    };

    var mongoose = require('mongoose');
    var q = require('q');
    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);
    return api;


    function findAllEventsOfUser (userId) {
        var defer = q.defer();
        UserModel
            .findOne({ _id: userId } )
            .populate('eventsCreated')
            .exec(function (err, user) {
                if (err) {
                    defer.reject({status:"KO"}) ;
                }
                else {
                    defer.resolve(user.eventsCreated);
                }});

        return defer.promise;

    }


    function addEventToUser (userId, eventId) {


        var deferred =  q.defer();
        UserModel.findOne({_id : userId}, function(err, User) {
            if (err){
                console.log("Page not found: " + pageId);
                deferred.reject({status:"KO",
                    description:"Some Error Occurred!!"});

            }
            else if (User){
                User.eventsCreated.push(eventId);
                User.save(function (err, updatedUser) {
                    if (err) {
                        deferred.reject({status:"KO",
                            description:"Some Error Occurred!!"});
                    }
                    else {
                        deferred.resolve(eventId);
                    }
                });
            }
            else {
                deferred.reject({status:"KO",
                    description:"Some Error Occurred!!"});
            }
        });
        return deferred.promise;
    }
    function searchUsers (searchArray ,userId) {
        var q1 =  q.defer();
        UserModel.find({ $and:[ { $text: { $search: searchArray }},{ _id:{ $ne: userId }} ,{userType:{ $ne: "A" }},{userType:{ $ne: "E" }}]}, {password : 0},function (err ,users) {
            if(err)
                q1.reject();
            else
                q1.resolve(users);
        });
        return q1.promise;
    }


    function searchNonAdminUsers(searchArray) {
        var q1 =  q.defer();
        UserModel.find({ $and:[ { $text: { $search: searchArray }},{userType:{ $ne: "A" }}]},
        {password : 0},function (err ,users) {
            if(err)
                q1.reject();
            else
                q1.resolve(users);
        });
        return q1.promise;
    }

    // userID1 will be the one following the userId2

    function findUserByEmail(emailAddress) {
        var defer =  q.defer();
        UserModel.findOne({email:emailAddress}, function(err, foundUser) {
            if (err){
                defer.reject(err);
            }
            else {
                defer.resolve(foundUser);
            }
        });
        return defer.promise;
    }

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
                q1.reject(err);
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
            .findOne({ _id: userId } )
            .populate('followers',{password : 0})
            .exec(function (err, user) {
                if(user)
                {
                    q1.resolve(user.followers);
                }
                else
                    q1.reject(err) ;
            });
        return q1.promise;
    }


    function findFollowingById(userId)
    {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('following',{password : 0})
            .exec(function (err, user) {
                if(user)
                {
                    q1.resolve(user.following);
                }
                else
                    q1.reject(err) ;
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
                q1.reject(err);
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
    function deleteUser(userId) {
        var deferred =  q.defer();
        UserModel.findOneAndRemove({_id:userId}, function(err, foundUser) {
            if (err){
                deferred.reject(err);
            }
            else {

                deferred.resolve(foundUser);
            }

        });
        return deferred.promise;
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
            if(err) {
                q1.reject(err);
            }
            else {
                q1.resolve(user);
            }
        });
        return q1.promise ;
    }

    function findAllAlbums(userId) {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('album')
            .exec(function (err, user) {
                if(err)
                {
                    q1.reject(err) ;
                }
                else
                    q1.resolve(user);
            });

        return q1.promise;
    }

    function findAllplayLists(userId) {
        var q1 = q.defer();
        UserModel
            .findOne({ _id: userId })
            .populate('playList')
            .exec(function (err, user) {
                if (err) {
                    q1.reject(err) ;
                }
                else {
                    q1.resolve(user);
                }
            });

        return q1.promise;
    }

    function createUser(user) {
        var q1 =  q.defer() ;
        UserModel.create(user ,function (err , user) {
            if(err){
                q1.reject(err);
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
                user.save(function (err, updatedUser) {
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

    function addplayList(playList,flag) {
        var q1 =  q.defer();
        UserModel.findOne({_id:playList.playListOwner}, function(err, user) {
            if (err){
                q1.reject(err);
            }
            else if (user){
                user.playList.push(playList._id);
                if (flag) {
                    user.favPlayList = playList._id;
                }
                user.save(function (err, updatedUser) {
                    if (err) {
                        q1.reject(err);
                    }
                    else {
                        q1.resolve(updatedUser);
                    }
                });
            }
        });
        return q1.promise;
    }
    function deleteEventIdFromUser(userId, eventId) {
        var deferred=q.defer();
        UserModel.update({_id: userId},
            {$pull: {eventsCreated: eventId}},
            function (err, result) {
                if (err){
                    deferred.reject();
                }
                else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    }
};