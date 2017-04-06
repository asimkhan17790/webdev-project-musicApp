/**
 * Created by sumitbhanwala on 4/5/17.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var playListSchema = mongoose.Schema({
        playListname : {type :String , required: true},
        id : String,
        dateCreated : {type : Date , default :Date.now()},
        playListOwner : String,
        songs : [{type :mongoose.Schema.Types.ObjectId , ref:'songModel'}]
    },{collection: 'playList'});
    return playListSchema;
};