/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    var albumSchema = mongoose.Schema({
        albumname : {type :String , required: true},
        id : String,
        dateCreated : {type : Date , default :Date.now()},
        albumOwner : String,
        albumgenrea :String,
        songs : [{type :mongoose.Schema.Types.ObjectId , ref:'songModel'}],
    },{collection: 'album'});
    return albumSchema;
};