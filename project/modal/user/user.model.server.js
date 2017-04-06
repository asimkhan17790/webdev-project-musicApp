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
        addalbum : addalbum
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);
    return api;

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

};