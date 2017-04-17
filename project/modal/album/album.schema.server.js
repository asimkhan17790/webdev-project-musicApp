/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    var albumSchema = mongoose.Schema({
        albumname : {type :String , required: true},
        dateCreated : {type : Date , default :Date.now()},
        albumOwner : String,
        albumgenre :String,
        albumThumbNail : String,
        songs : [{type :mongoose.Schema.Types.ObjectId , ref:'songModel'}],
    },{collection: 'album'});
    return albumSchema;
};
// have to add album owner in this album and the same albub for that particular use
// and have to close the popup for the modal after a album have been created