/**
 * Created by sumitbhanwala on 4/4/17.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var userSchema = mongoose.Schema({
        username : {type :String , required: true},
        password : String,
        firstName : String,
        lastName :  String,
        email : String,
        phone : String,
        gender : String,
        dateCreated : {type : Date , default :Date.now()},
        imageURL : String ,
        userType : {type : String, enum : ['E', 'U', 'M', 'S','A']},
        playList : [{type :mongoose.Schema.Types.ObjectId , ref:'playListModel'}],
        album : [{type :mongoose.Schema.Types.ObjectId , ref:'albumModel'}],
        followers :[{type :mongoose.Schema.Types.ObjectId , ref:'UserModel'}],
        following :[{type :mongoose.Schema.Types.ObjectId , ref:'UserModel'}],
    },{collection: 'user'});

    userSchema.index({ firstName: 'text', lastName: 'text', username: 'text'});
    return userSchema;
};
// playlist and songs will be created later as datamodel which this particular user
// model will user and need to identify the playlist and albums and songs
// picture url and geolation is not being used right now but maybe later